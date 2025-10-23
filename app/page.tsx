import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="w-full max-w-3xl mx-auto flex-1 flex flex-col items-center text-center gap-8">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="AI Chat Logo" width={48} height={48} />
          <span className="text-2xl sm:text-3xl font-semibold">AI Chat</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-bold leading-tight">
          Download AI Chat for Android
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl">
          Experience fast, AI chat. Get the latest APK and start chatting with your AI assistant in seconds.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-[600px]">
          <a
            href="/apk/app-release.apk"
            download
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
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

          <a
            href="/video"
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 inline-flex items-center justify-center gap-2"
          >
            {/* Play icon */}
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
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Watch Demo</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full mt-6">
          <div className="rounded-lg border p-4 text-left">
            <div className="font-semibold mb-1">Built in 2 Days</div>
            <div className="text-sm text-muted-foreground">Rapidly shipped from idea to APK in just two days.</div>
          </div>
          <div className="rounded-lg border p-4 text-left">
            <div className="font-semibold mb-1">AI Agents with Tools</div>
            <div className="text-sm text-muted-foreground">Agentic workflows with Wikipedia and Google Scholar tools for research and citation.</div>
          </div>
          <div className="rounded-lg border p-4 text-left">
            <div className="font-semibold mb-1">Built with React Native</div>
            <div className="text-sm text-muted-foreground">Modern cross‑platform UI, optimized for Android devices.</div>
          </div>
          <div className="rounded-lg border p-4 text-left">
            <div className="font-semibold mb-1">Chat Interface</div>
            <div className="text-sm text-muted-foreground">Chat with history and memory that remembers context, plus markdown view.</div>
          </div>
        </div>
        <div className="w-full mt-2 text-left">
          <div className="font-semibold mb-1">GitHub Repos</div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://github.com/deepak-coding-art/ai_chat_app"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
            >
              {/* Code icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              <span>App (React Native)</span>
            </a>
            <a
              href="https://github.com/deepak-coding-art/ai_chat_server"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 border rounded-lg px-4 py-2 text-sm transition-colors hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a]"
            >
              {/* Server icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                <line x1="6" y1="6" x2="6.01" y2="6" />
                <line x1="6" y1="18" x2="6.01" y2="18" />
              </svg>
              <span>Backend</span>
            </a>
          </div>
        </div>
      </main>

      <footer className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground mt-10">
        <span>Built with</span>
        {/* Heart icon (Lucide-style inline SVG) */}
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
