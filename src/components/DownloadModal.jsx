import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"

const WindowsIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M0 93.7l183.6-25.3v177.4H0V93.7zm0 324.6l183.6 25.3V268.4H0v149.9zm203.8 28L448 480V268.4H203.8v177.9zm0-380.6v180.1H448V32L203.8 65.7z" />
  </svg>
)

const AppleIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className={className} fill="currentColor">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
)

const LinuxIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className={className} fill="currentColor">
    <path d="M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.7.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.5zM420 432c-3.1 0-6.8-2.6-10.2-6.5C396 410 376 394 353 381c-6-3.4-13.4-7.5-20.7-9.5-13.9-3.8-28.5-4-42.5-4h-55.3c-14.1 0-28.6.2-42.5 4-7.4 2-14.8 6.1-20.7 9.5-23 13-43 29-56.8 44.5-3.4 3.9-7.1 6.5-10.2 6.5-4 0-7.3-3.6-10-8.8C89.5 410 82 390.6 82 376.1c0-11.2 6-24.9 16.4-38.3 8.3-10.7 19.5-22.3 32-34.4 19.3-18.7 41-39.7 54.4-65.7 6.4-12.4 10.3-26.6 11.2-41.9.4-7.8-1.7-18.1-1.3-28.5.5-15.5 1.7-32 10.4-45.7 7.7-12.1 19.8-19.1 32.8-22.5 13.5-3.5 28.5-3.3 42.1-.4 12.3 2.6 23.5 8.7 30.7 19.5 8.4 12.7 9.5 28.8 10 43.6.4 11 1.1 22.1-.4 30.4-1.1 6-2.5 11.7-2.7 17.5-.1 4.5.3 11 1.7 18 3.5 17 12 36.6 24 53 11.7 15.9 26.6 30.3 41.5 44.4 10.1 9.6 20.3 19.3 28.5 29.5 10.4 12.8 16.4 26.5 16.4 37.7 0 14.5-7.5 33.9-12.4 46.1-2.6 5.2-6 8.8-10 8.8zm-192.8-232c2.1 0 3.7-1.1 4.9-2.7 1.4-1.8 1.6-4.5 1.3-7.2-.4-4-2.8-7.9-6.3-9.5-2.2-1-4.7-1.2-7.1-1.1-1.3.1-2.7.3-3.9.7-1.4.5-2.7 1.3-3.8 2.3-.9.9-1.6 2-2.1 3.2-.6 1.4-.9 3-.9 4.6 0 1.9.5 3.7 1.3 5.3 1.1 2.2 3.1 3.8 5.4 4.5 1.6.5 3.3.6 4.9.4.5.1 1.1 0 1.6-.1.6 0 1.2-.2 1.8-.3-1.6-.5-3-1.2-4.1-2.2-1.3-1.1-2.2-2.6-2.5-4.3-.2-1.3-.1-2.6.4-3.8.5-1.2 1.3-2.2 2.3-3 1.2-1 2.7-1.5 4.3-1.6 1.5-.1 3 .3 4.2 1 1.4.9 2.5 2.2 3.1 3.7.6 1.4.8 3 .5 4.5-.3 1.5-1.2 2.8-2.3 3.8-1.1.9-2.5 1.5-4 1.7-1.3.2-2.7.1-4-.3-1.2-.4-2.3-1.1-3.2-2-.8-.9-1.5-1.9-1.9-3.1-.4-1.3-.6-2.7-.5-4 .1-1.4.6-2.7 1.4-3.8 1-1.3 2.4-2.2 3.9-2.8 1.6-.6 3.4-.8 5.1-.5 1.8.3 3.5 1 4.9 2.1 1.5 1.2 2.6 2.8 3.2 4.6.6 1.8.7 3.8.3 5.6-.4 1.9-1.4 3.6-2.7 4.9-1.5 1.4-3.4 2.4-5.5 2.8-1.8.4-3.8.4-5.7-.1-1.8-.5-3.4-1.4-4.8-2.6-1.5-1.3-2.6-2.9-3.3-4.8-.6-1.8-.8-3.8-.4-5.7.4-1.9 1.4-3.6 2.7-4.9 1.5-1.4 3.4-2.4 5.5-2.8 1.8-.4 3.8-.4 5.7.1 1.8.5 3.4 1.4 4.8 2.6 1.5 1.3 2.6 2.9 3.3 4.8.6 1.8.8 3.8.4 5.7-.4 1.9-1.4 3.6-2.7 4.9-1.5 1.4-3.4 2.4-5.5 2.8-1.8.4-3.8.4-5.7-.1-1.8-.5-3.4-1.4-4.8-2.6-1.5-1.3-2.6-2.9-3.3-4.8-.6-1.8-.8-3.8-.4-5.7.4-1.9 1.4-3.6 2.7-4.9 1.5-1.4 3.4-2.4 5.5-2.8 1.8-.4 3.8-.4 5.7.1 1.8.5 3.4 1.4 4.8 2.6 1.5 1.3 2.6 2.9 3.3 4.8.6 1.8.8 3.8.4 5.7-.4 1.9-1.4 3.6-2.7 4.9-1.5 1.4-3.4 2.4-5.5 2.8-1.8.4-3.8.4-5.7-.1-1.8-.5-3.4-1.4-4.8-2.6-1.5-1.3-2.6-2.9-3.3-4.8-.6-1.8-.8-3.8-.4-5.7.4-1.9 1.4-3.6 2.7-4.9 1.5-1.4 3.4-2.4 5.5-2.8 1.8-.4 3.8-.4 5.7.1zM286.2 192c-1.3-1.4-3.1-2.2-5.1-2.4-1.8-.2-3.7.3-5.2 1.3-1.5 1-2.6 2.5-3.1 4.2-.6 1.7-.5 3.6.1 5.3.6 1.7 1.8 3.1 3.3 4 1.5.9 3.3 1.2 5.1 1 1.7-.2 3.3-1.1 4.5-2.4 1.2-1.3 1.9-3 2-4.8.1-1.8-.5-3.6-1.6-4.9-1.3-1.5-3.2-2.5-5.3-2.6-1.9-.1-3.9.5-5.5 1.6-1.5 1.1-2.6 2.7-3.1 4.5-.5 1.8-.4 3.8.3 5.5.7 1.7 1.9 3.1 3.5 3.9 1.6.8 3.5 1.1 5.3.8 1.8-.3 3.4-1.3 4.6-2.6 1.2-1.4 1.9-3.2 1.9-5.1-.1-1.9-.8-3.7-2-5.1-1.3-1.5-3.2-2.5-5.3-2.6-1.9-.1-3.9.5-5.5 1.6-1.5 1.1-2.6 2.7-3.1 4.5-.5 1.8-.4 3.8.3 5.5.7 1.7 1.9 3.1 3.5 3.9 1.6.8 3.5 1.1 5.3.8 1.8-.3 3.4-1.3 4.6-2.6 1.2-1.4 1.9-3.2 1.9-5.1-.1-1.9-.8-3.7-2-5.1-1.3-1.5-3.2-2.5-5.3-2.6-1.9-.1-3.9.5-5.5 1.6-1.5 1.1-2.6 2.7-3.1 4.5-.5 1.8-.4 3.8.3 5.5.7 1.7 1.9 3.1 3.5 3.9 1.6.8 3.5 1.1 5.3.8 1.8-.3 3.4-1.3 4.6-2.6 1.2-1.4 1.9-3.2 1.9-5.1-.1-1.9-.8-3.7-2-5.1z" />
  </svg>
)

export function DownloadModal({ open, onClose, gameId }) {
  const handleDownload = (platform) => {
    window.location.href = `/api/itch?gameId=${gameId}&platform=${platform}`
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              style={{ width: "min(400px, 90vw)" }}
              className="pointer-events-auto rounded-xl border border-border/50 bg-background flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
                <h3 className="font-bold text-base">Select Platform</h3>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 flex items-center justify-center gap-8">
                <button
                  onClick={() => handleDownload('windows')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <WindowsIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Windows</span>
                </button>

                <button
                  onClick={() => handleDownload('mac')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <AppleIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">macOS</span>
                </button>

                <button
                  onClick={() => handleDownload('linux')}
                  className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <LinuxIcon className="w-8 h-8" />
                  <span className="text-sm font-medium">Linux</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
