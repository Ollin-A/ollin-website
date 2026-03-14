import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BookingSystemTrades from "./BookingSystemTrades";
import SecondaryButton from "./SecondaryButton";

type Step = {
    title: string;
    desc: string;
    detail: string;
};

const BookingSystemSection: React.FC = () => {
    const steps: Step[] = useMemo(
        () => [
            {
                title: "Get found locally",
                desc: "Show up when people search near you.",
                detail: "We tune Maps + local signals so you appear where it counts.",
            },
            {
                title: "Bring in real calls",
                desc: "Ads that bring serious leads, not time-wasters.",
                detail: "Targeting, offers, and weekly tuning focused on booked jobs.",
            },
            {
                title: "Look legit fast",
                desc: "A website that builds trust in seconds.",
                detail: "Clear services, proof, and a simple path to request an estimate.",
            },
            {
                title: "Reply in minutes",
                desc: "Missed call → instant text-back.",
                detail: "Fast replies that stop leads from going to competitors.",
            },
            {
                title: "Keep the loop running.",
                desc: "More 5-stars. More booked work.",
                detail: "Follow-ups, review requests, and rebook nudges that run in the background.",
            },
        ],
        []
    );

    const navigate = useNavigate();

    return (
        <section id="system" className="relative w-full bg-[#F2F2F2] text-ollin-black py-20 md:py-28">

            <div className="max-w-[1500px] mx-auto px-[5vw] w-full">

                <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 items-start">

                    <div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl tracking-tight leading-[1.02] font-medium">
                            How jobs get booked.
                        </h3>
                        <p className="mt-4 text-base md:text-lg leading-snug text-ollin-black/70 max-w-[520px]">
                            A clear system that turns demand into booked work.
                        </p>

                        <SecondaryButton
                            onClick={() => navigate("/services/retention")}
                            label="Get a quick breakdown"
                            className="mt-8 text-sm font-semibold tracking-tight"
                        />
                    </div>

                    <div className="relative">

                        <div className="pointer-events-none absolute left-[14px] top-0 bottom-0 w-px bg-black/10" />

                        <div className="space-y-6">
                            {steps.map((s) => (
                                <div
                                    key={s.title}
                                    className={["group relative pl-10 pr-4 py-4", "transition-colors duration-200"].join(" ")}
                                >

                                    <span
                                        className={[
                                            "absolute left-[9px] top-[26px]",
                                            "h-[10px] w-[10px] rounded-full",
                                            "bg-[#9D9B97]",
                                            "transition-colors duration-200",
                                            "group-hover:bg-[#61605D]",
                                        ].join(" ")}
                                    />

                                    <div className="relative">
                                        <div className="text-lg md:text-xl font-medium tracking-tight">{s.title}</div>
                                        <div className="mt-1 text-sm md:text-[15px] leading-snug text-ollin-black/65">{s.desc}</div>

                                        <div className="mt-2 text-xs md:text-sm text-ollin-black/55 opacity-0 translate-y-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                                            {s.detail}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="my-16 md:my-20 h-px w-full bg-[#F2F2F2]" />

                <BookingSystemTrades />
            </div>
        </section>
    );
};

export default BookingSystemSection;
