import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
    className?: string;
    /** Elemento donde capturas el mouse (todo el footer) */
    interactionRef?: React.RefObject<HTMLElement>;
}

const CONFIG = {
    colors: {
        body: 0x222222,
        head: 0x333333,
        eye: 0xffffff,
        pupil: 0x111111,
        emissiveScreen: 0x4f46e5,
        hats: [0xfacc15, 0xf97316, 0xffffff],
        vest: 0xfacc15,
        coneOrange: 0xff4500,
        coneWhite: 0xffffff,

        // Lentes tipo “Truper” (mostaza / amarillo raro)
        glassesMustard: 0xd7b225, // mostaza
        glassesFrame: 0x1f1f1f, // armazón oscuro
    },
    motion: {
        targetZ: 2.6,
        targetLerp: 0.18,
        headSlerp: 0.14,
        maxYaw: 0.95,
        maxPitch: 0.58,
        idleReturnSeconds: 1.1,
        breatheSpeed: 2.0,
        breatheAmp: 0.03,
    },
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

type Char = {
    group: THREE.Group;
    headPivot: THREE.Group;
    eyes: THREE.Object3D[];
    pupils: THREE.Mesh[];
    baseY: number;
    phase: number;
    blinkTimer: number;
    trackSpeed: number;
};

const ConstructionCrowdInteractive: React.FC<Props> = ({ className, interactionRef }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const charsRef = useRef<Char[]>([]);
    const mouseNdcRef = useRef(new THREE.Vector2(0, 0));
    const targetWorldRef = useRef(new THREE.Vector3(0, -0.9, CONFIG.motion.targetZ));
    const frameIdRef = useRef<number>(0);
    const lastMoveTimeRef = useRef<number>(0);

    useEffect(() => {
        if (!mountRef.current) return;

        const mountEl = mountRef.current;

        // --- SCENE ---
        const scene = new THREE.Scene();
        scene.background = null;
        sceneRef.current = scene;

        // --- CAMERA ---
        const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 50);
        camera.position.set(0, 3, 11);
        camera.lookAt(0, 0, 0);
        cameraRef.current = camera;

        // --- RENDERER ---
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.1;

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        mountEl.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // --- RESIZE ---
        const handleResize = () => {
            if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
            const w = mountRef.current.clientWidth;
            const h = mountRef.current.clientHeight;
            if (w <= 0 || h <= 0) return;

            cameraRef.current.aspect = w / h;
            cameraRef.current.updateProjectionMatrix();
            rendererRef.current.setSize(w, h);
            rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        handleResize();

        window.addEventListener("resize", handleResize);
        const ro = new ResizeObserver(handleResize);
        ro.observe(mountEl);

        // --- LIGHTS ---
        scene.add(new THREE.AmbientLight(0xffffff, 0.78));

        const key = new THREE.DirectionalLight(0xffffff, 1.2);
        key.position.set(5, 10, 5);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        key.shadow.bias = -0.001;
        scene.add(key);

        const rim = new THREE.DirectionalLight(0xc7d2fe, 0.72);
        rim.position.set(-5, 5, -5);
        scene.add(rim);

        const screenLight = new THREE.PointLight(CONFIG.colors.emissiveScreen, 4, 8);
        screenLight.position.set(0, -0.5, 2.0);
        scene.add(screenLight);

        // --- MATERIALS ---
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.colors.body,
            roughness: 0.78,
            metalness: 0.06,
        });
        const headMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.colors.head,
            roughness: 0.55,
            metalness: 0.04,
        });
        const eyeMaterial = new THREE.MeshStandardMaterial({
            color: CONFIG.colors.eye,
            roughness: 0.2,
            metalness: 0.0,
        });
        const pupilMaterial = new THREE.MeshBasicMaterial({ color: CONFIG.colors.pupil });

        // Lentes (Truper vibe) — lente mostaza translúcido + armazón del mismo color (pero aquí lo dejé oscuro para que lea bien)
        // Si quieres TODO del mismo color (armazón también mostaza), cambia glassesFrameMat a CONFIG.colors.glassesMustard.
        const glassesLensMat = new THREE.MeshPhysicalMaterial({
            color: CONFIG.colors.glassesMustard,
            transparent: true,
            opacity: 0.38, // leve transparencia
            transmission: 0.85,
            roughness: 0.12,
            metalness: 0,
            ior: 1.4,
            thickness: 0.03,
            side: THREE.DoubleSide,
            clearcoat: 1,
            clearcoatRoughness: 0.15,
        });

        const glassesFrameMat = new THREE.MeshStandardMaterial({
            color: CONFIG.colors.glassesFrame,
            roughness: 0.5,
            metalness: 0.15,
        });

        // --- GEOMETRIES ---
        const bodyGeo = new THREE.CapsuleGeometry(0.55, 0.7, 4, 8);
        const headGeo = new THREE.SphereGeometry(0.48, 24, 24);
        const eyeGeo = new THREE.SphereGeometry(0.12, 16, 16);
        const pupilGeo = new THREE.SphereGeometry(0.05, 10, 10);

        // Hardhat
        const hardHatGeo = new THREE.SphereGeometry(0.52, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        const hardHatBrimGeo = new THREE.TorusGeometry(0.5, 0.07, 10, 32);
        const hardHatCapGeo = new THREE.CircleGeometry(0.5, 32);
        hardHatCapGeo.rotateX(-Math.PI / 2);

        // Cone
        const coneGeo = new THREE.ConeGeometry(0.34, 0.88, 40);
        const stripeGeo = new THREE.TorusGeometry(0.2, 0.055, 10, 40);

        // ✅ Base del cono (labio) para que se lea como cono de obra
        const coneBaseGeo = new THREE.CylinderGeometry(0.43, 0.43, 0.06, 48);

        // Safety glasses (Truper shield vibe): visor casi plano con ligera curvatura + top frame + patillas
        const shieldGeo = new THREE.BoxGeometry(0.70, 0.22, 0.03); // visor principal
        const shieldCurveGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.22, 50, 1, true, Math.PI * 0.20, Math.PI * 0.60);
        const topFrameGeo = new THREE.BoxGeometry(0.74, 0.05, 0.05);
        const armGeo = new THREE.BoxGeometry(0.20, 0.03, 0.03);
        const noseGeo = new THREE.BoxGeometry(0.10, 0.04, 0.04);

        // --- SHADOW PLANE ---
        const shadowPlaneGeo = new THREE.PlaneGeometry(100, 100);
        const shadowMat = new THREE.ShadowMaterial({ opacity: 0.14 });
        const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -2.0;
        shadowPlane.receiveShadow = true;
        scene.add(shadowPlane);

        // --- LAPTOP ---
        const laptopGroup = new THREE.Group();

        const baseGeo = new THREE.BoxGeometry(2.4, 0.1, 1.6);
        const baseMat = new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.35, metalness: 0.8 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.castShadow = true;
        base.receiveShadow = true;

        const screenFrameGeo = new THREE.BoxGeometry(2.4, 1.5, 0.1);
        const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.25, metalness: 0.5 });

        const displayGeo = new THREE.PlaneGeometry(2.2, 1.3);
        const displayMat = new THREE.MeshStandardMaterial({
            color: CONFIG.colors.emissiveScreen,
            emissive: CONFIG.colors.emissiveScreen,
            emissiveIntensity: 1.6,
            roughness: 0.2,
        });

        const screenFrame = new THREE.Mesh(screenFrameGeo, screenFrameMat);
        const display = new THREE.Mesh(displayGeo, displayMat);
        display.position.z = 0.06;
        screenFrame.add(display);

        screenFrame.position.set(0, 0.75, -0.8);
        screenFrame.rotation.x = -Math.PI / 12;

        laptopGroup.add(base);
        laptopGroup.add(screenFrame);

        laptopGroup.position.set(0, -1.95, 2.5);
        laptopGroup.rotation.y = Math.PI;
        scene.add(laptopGroup);

        // --- HELPERS: create accessories ---
        const createHardHat = () => {
            const hatColor = CONFIG.colors.hats[Math.floor(Math.random() * CONFIG.colors.hats.length)];
            const hatMat = new THREE.MeshStandardMaterial({
                color: hatColor,
                roughness: 0.45,
                metalness: 0.05,
                side: THREE.DoubleSide,
            });

            const hat = new THREE.Mesh(hardHatGeo, hatMat);
            hat.castShadow = true;

            const brim = new THREE.Mesh(hardHatBrimGeo, hatMat);
            brim.castShadow = true;
            brim.rotation.x = Math.PI / 2;
            brim.position.y = 0.0;

            const cap = new THREE.Mesh(hardHatCapGeo, hatMat);
            cap.position.y = 0.0;

            hat.add(brim);
            hat.add(cap);

            (hat as any).__mat = hatMat;
            return hat;
        };

        const createCone = () => {
            const mat = new THREE.MeshStandardMaterial({
                color: CONFIG.colors.coneOrange,
                roughness: 0.45,
                side: THREE.DoubleSide,
            });

            const coneGroup = new THREE.Group();

            const cone = new THREE.Mesh(coneGeo, mat);
            cone.castShadow = true;
            cone.position.y = 0.0;
            coneGroup.add(cone);

            // Stripe
            const stripeMat = new THREE.MeshStandardMaterial({
                color: CONFIG.colors.coneWhite,
                roughness: 0.6,
                side: THREE.DoubleSide,
            });
            const stripe = new THREE.Mesh(stripeGeo, stripeMat);
            stripe.rotation.x = Math.PI / 2;
            stripe.position.y = -0.12;
            cone.add(stripe);

            // ✅ Base / labio
            const baseMat2 = new THREE.MeshStandardMaterial({
                color: CONFIG.colors.coneOrange,
                roughness: 0.55,
                side: THREE.DoubleSide,
            });
            const baseRing = new THREE.Mesh(coneBaseGeo, baseMat2);
            baseRing.position.y = -0.41; // cerca de la base del cono
            baseRing.castShadow = true;
            coneGroup.add(baseRing);

            (cone as any).__geo = coneGeo;
            (cone as any).__mat = mat;
            (stripe as any).__geo = stripeGeo;
            (stripe as any).__mat = stripeMat;
            (baseRing as any).__geo = coneBaseGeo;
            (baseRing as any).__mat = baseMat2;

            return coneGroup;
        };

        // ✅ NUEVOS lentes estilo “Truper” (shield + frame + patillas), sin verse bug
        const createSafetyGlasses = () => {
            const g = new THREE.Group();

            // visor: usamos cilindro abierto para dar ligera curvatura (más natural)
            const shield = new THREE.Mesh(shieldCurveGeo, glassesLensMat);
            shield.rotation.y = Math.PI; // mira hacia adelante
            shield.position.set(0, 0.12, 0.46);
            shield.castShadow = false;
            g.add(shield);

            // (opcional) un “panel” fino para dar cuerpo al lente (no se ve como ceja)
            const panel = new THREE.Mesh(shieldGeo, glassesLensMat);
            panel.position.set(0, 0.12, 0.45);
            panel.castShadow = false;
            g.add(panel);

            // frame superior (tipo Truper)
            const top = new THREE.Mesh(topFrameGeo, glassesFrameMat);
            top.position.set(0, 0.22, 0.42);
            g.add(top);

            // puente/nariz
            const nose = new THREE.Mesh(noseGeo, glassesFrameMat);
            nose.position.set(0, 0.11, 0.43);
            g.add(nose);

            // patillas
            const armL = new THREE.Mesh(armGeo, glassesFrameMat);
            const armR = new THREE.Mesh(armGeo, glassesFrameMat);
            armL.position.set(-0.38, 0.16, 0.25);
            armR.position.set(0.38, 0.16, 0.25);
            armL.rotation.y = 0.55;
            armR.rotation.y = -0.55;
            g.add(armL);
            g.add(armR);

            // marcar geos
            (shield as any).__geo = shieldCurveGeo;
            (panel as any).__geo = shieldGeo;
            (top as any).__geo = topFrameGeo;
            (nose as any).__geo = noseGeo;
            (armL as any).__geo = armGeo;
            (armR as any).__geo = armGeo;

            return g;
        };

        // --- CHARACTERS ---
        const chars: Char[] = [];
        const rows = [
            { count: 6, y: -1.7, z: 1.0 },
            { count: 5, y: -1.0, z: 0.0 },
            { count: 4, y: -0.4, z: -1.0 },
            { count: 3, y: 0.2, z: -1.8 },
        ];

        let charIndex = 0;

        rows.forEach((row) => {
            const spacing = 0.9;
            const startX = -((row.count - 1) * spacing) / 2;

            for (let i = 0; i < row.count; i++) {
                const x = startX + i * spacing + (Math.random() * 0.2 - 0.1);
                const y = row.y + Math.random() * 0.1;
                const z = row.z + (Math.random() * 0.3 - 0.15);

                const group = new THREE.Group();
                group.position.set(x, y, z);

                // body / vest
                const body = new THREE.Mesh(bodyGeo, bodyMaterial);
                body.castShadow = true;
                body.receiveShadow = true;

                if (Math.random() > 0.6) {
                    const vestGeo = new THREE.CapsuleGeometry(0.56, 0.65, 4, 8);
                    const vestMat = new THREE.MeshStandardMaterial({
                        color: CONFIG.colors.vest,
                        roughness: 0.82,
                        metalness: 0.02,
                    });
                    const vest = new THREE.Mesh(vestGeo, vestMat);
                    vest.position.y = -0.1;
                    vest.castShadow = true;
                    vest.receiveShadow = true;
                    group.add(vest);

                    (vest as any).__geo = vestGeo;
                    (vest as any).__mat = vestMat;
                } else {
                    group.add(body);
                }

                // head pivot
                const headPivot = new THREE.Group();
                headPivot.position.set(0, 0.6, 0);
                group.add(headPivot);

                const head = new THREE.Mesh(headGeo, headMaterial);
                head.castShadow = true;
                head.receiveShadow = true;
                headPivot.add(head);

                // eyes + pupils
                const leftEye = new THREE.Mesh(eyeGeo, eyeMaterial);
                leftEye.position.set(-0.18, 0.1, 0.38);
                const rightEye = new THREE.Mesh(eyeGeo, eyeMaterial);
                rightEye.position.set(0.18, 0.1, 0.38);

                const leftPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
                leftPupil.position.set(0, 0, 0.1);
                leftEye.add(leftPupil);

                const rightPupil = new THREE.Mesh(pupilGeo, pupilMaterial);
                rightPupil.position.set(0, 0, 0.1);
                rightEye.add(rightPupil);

                headPivot.add(leftEye);
                headPivot.add(rightEye);

                // accessories logic
                const hasCone = charIndex === 7;
                const hasSafetyGlasses = !hasCone && Math.random() > 0.83;
                const hasHardHat = !hasCone;

                if (hasHardHat) {
                    const hat = createHardHat();
                    hat.position.set(0, 0.37, 0);
                    hat.rotation.x = -0.2;
                    headPivot.add(hat);
                }

                if (hasCone) {
                    const cone = createCone();
                    // ✅ BAJARLO (antes 1.02) y centrarlo mejor
                    cone.position.set(0, 0.82, 0.02);
                    cone.rotation.x = -0.12;
                    headPivot.add(cone);
                }

                if (hasSafetyGlasses) {
                    const glasses = createSafetyGlasses();
                    headPivot.add(glasses);
                }

                chars.push({
                    group,
                    headPivot,
                    eyes: [leftEye, rightEye],
                    pupils: [leftPupil, rightPupil],
                    baseY: y,
                    phase: Math.random() * Math.PI * 2,
                    blinkTimer: Math.random() * 1400 + 600,
                    trackSpeed: CONFIG.motion.headSlerp + Math.random() * 0.04,
                });

                scene.add(group);
                charIndex++;
            }
        });

        charsRef.current = chars;

        // --- POINTER ---
        const interactionEl: HTMLElement | null = interactionRef?.current ?? mountEl;

        const updatePointer = (clientX: number, clientY: number) => {
            if (!mountRef.current) return;
            const rect = mountRef.current.getBoundingClientRect();

            let x = ((clientX - rect.left) / rect.width) * 2 - 1;
            let y = -(((clientY - rect.top) / rect.height) * 2 - 1);

            x = clamp(x, -1, 1);
            y = clamp(y, -1, 1);

            mouseNdcRef.current.set(x, y);
            lastMoveTimeRef.current = performance.now();
        };

        const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
        const onTouchMove = (e: TouchEvent) => {
            if (e.touches.length === 0) return;
            const t = e.touches[0];
            updatePointer(t.clientX, t.clientY);
        };

        interactionEl?.addEventListener("pointermove", onPointerMove, { passive: true });
        interactionEl?.addEventListener("touchmove", onTouchMove, { passive: true });

        // --- ANIMATION ---
        const clock = new THREE.Clock();
        const raycaster = new THREE.Raycaster();
        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -CONFIG.motion.targetZ);

        const tmpHit = new THREE.Vector3();
        const tmpTargetLocal = new THREE.Vector3();
        const tmpDir = new THREE.Vector3();
        const tmpEuler = new THREE.Euler();
        const tmpQuat = new THREE.Quaternion();

        const animate = () => {
            frameIdRef.current = requestAnimationFrame(animate);
            if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;

            const delta = clock.getDelta();
            const time = clock.getElapsedTime();

            const secondsSinceMove = (performance.now() - lastMoveTimeRef.current) / 1000;

            if (lastMoveTimeRef.current > 0 && secondsSinceMove <= CONFIG.motion.idleReturnSeconds) {
                raycaster.setFromCamera(mouseNdcRef.current, cameraRef.current);
                if (raycaster.ray.intersectPlane(plane, tmpHit)) {
                    targetWorldRef.current.lerp(tmpHit, CONFIG.motion.targetLerp);
                }
            } else {
                const driftX = Math.sin(time * 0.35) * 0.9;
                const driftY = -0.9 + Math.cos(time * 0.25) * 0.25;
                tmpHit.set(driftX, driftY, CONFIG.motion.targetZ);
                targetWorldRef.current.lerp(tmpHit, 0.06);
            }

            const targetWorld = targetWorldRef.current;

            for (const c of charsRef.current) {
                c.group.position.y = c.baseY + Math.sin(time * CONFIG.motion.breatheSpeed + c.phase) * CONFIG.motion.breatheAmp;

                tmpTargetLocal.copy(targetWorld);
                c.group.worldToLocal(tmpTargetLocal);

                tmpDir.subVectors(tmpTargetLocal, c.headPivot.position);

                const yaw = clamp(Math.atan2(tmpDir.x, tmpDir.z), -CONFIG.motion.maxYaw, CONFIG.motion.maxYaw);
                const pitch = clamp(
                    -Math.atan2(tmpDir.y, Math.sqrt(tmpDir.x * tmpDir.x + tmpDir.z * tmpDir.z)),
                    -CONFIG.motion.maxPitch,
                    CONFIG.motion.maxPitch
                );

                tmpEuler.set(pitch, yaw, 0, "XYZ");
                tmpQuat.setFromEuler(tmpEuler);

                c.headPivot.quaternion.slerp(tmpQuat, c.trackSpeed);

                const px = clamp(yaw / CONFIG.motion.maxYaw, -1, 1) * 0.06;
                const py = clamp(-pitch / CONFIG.motion.maxPitch, -1, 1) * 0.05;
                c.pupils[0].position.set(px, py, 0.1);
                c.pupils[1].position.set(px, py, 0.1);

                c.blinkTimer -= delta * 1000;
                if (c.blinkTimer < 0) {
                    c.eyes.forEach((eye: any) => (eye.scale.y = 0.1));
                    if (c.blinkTimer < -120) {
                        c.eyes.forEach((eye: any) => (eye.scale.y = 1));
                        c.blinkTimer = Math.random() * 2200 + 800;
                    }
                }
            }

            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };

        lastMoveTimeRef.current = 0;
        animate();

        // --- CLEANUP ---
        return () => {
            cancelAnimationFrame(frameIdRef.current);

            window.removeEventListener("resize", handleResize);
            ro.disconnect();

            interactionEl?.removeEventListener("pointermove", onPointerMove as any);
            interactionEl?.removeEventListener("touchmove", onTouchMove as any);

            if (renderer.domElement.parentElement === mountEl) mountEl.removeChild(renderer.domElement);
            renderer.dispose();

            shadowPlaneGeo.dispose();
            shadowMat.dispose();

            baseGeo.dispose();
            baseMat.dispose();
            screenFrameGeo.dispose();
            screenFrameMat.dispose();
            displayGeo.dispose();
            displayMat.dispose();

            bodyGeo.dispose();
            headGeo.dispose();
            eyeGeo.dispose();
            pupilGeo.dispose();

            hardHatGeo.dispose();
            hardHatBrimGeo.dispose();
            hardHatCapGeo.dispose();

            coneGeo.dispose();
            stripeGeo.dispose();
            coneBaseGeo.dispose();

            shieldGeo.dispose();
            shieldCurveGeo.dispose();
            topFrameGeo.dispose();
            armGeo.dispose();
            noseGeo.dispose();

            bodyMaterial.dispose();
            headMaterial.dispose();
            eyeMaterial.dispose();
            pupilMaterial.dispose();
            glassesLensMat.dispose();
            glassesFrameMat.dispose();

            charsRef.current.forEach((cc) => {
                cc.group.traverse((obj: any) => {
                    if (obj?.__geo?.dispose) obj.__geo.dispose();
                    if (obj?.__mat?.dispose) obj.__mat.dispose();
                });
            });
        };
    }, [interactionRef]);

    return <div ref={mountRef} className={`w-full h-full overflow-hidden ${className ?? ""}`} />;
};

export default ConstructionCrowdInteractive;
