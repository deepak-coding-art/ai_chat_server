import Image from "next/image";
import Link from "next/link";

export default function VideoPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="w-full max-w-4xl mx-auto flex-1 flex flex-col items-center text-center gap-8">
                <div className="flex items-center gap-3">
                    <Image src="/logo.png" alt="AI Chat Logo" width={48} height={48} />
                    <span className="text-2xl sm:text-3xl font-semibold">AI Chat</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
                    AI Chat Demo Video
                </h1>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
                    Watch the demo to see AI Chat in action. Experience the power of on-device AI with agentic workflows and tool integration.
                </p>

                {/* Demo Video */}
                <div className="w-full max-w-md mx-auto">
                    <video
                        className="w-full rounded-lg shadow-2xl"
                        controls
                        preload="metadata"
                        poster="/logo.png"
                    >
                        <source src="/videos/project-video-720p.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-[600px]">
                    <Link
                        href="/"
                        className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                        {/* Arrow left icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M19 12H5" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        <span>Back to Home</span>
                    </Link>
                    <a
                        href="/apk/app-release.apk"
                        download
                        className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
                    >
                        {/* Download icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" x2="12" y1="15" y2="3" />
                        </svg>
                        <span>Download APK</span>
                    </a>
                </div>

            </main>

            <footer className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
                <span>Built with</span>
                {/* Heart icon */}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="text-pink-500"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>by</span>
                <a href="https://builddev.in" target="_blank" rel="noreferrer" className="underline underline-offset-4">
                    builddev.in
                </a>
            </footer>
        </div>
    );
}
