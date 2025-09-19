"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Gift, Heart, Sparkles, Volume2, VolumeX } from "lucide-react"

export default function BirthdayPage() {
  const [showSplash, setShowSplash] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add a small delay for more natural animation
            setTimeout(() => {
              entry.target.classList.add("visible")
            }, 100)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    const elements = document.querySelectorAll(".fade-in")
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [showSplash])

  const handleEnterSite = async () => {
    setShowSplash(false)
    setIsPlaying(true)

    if (audioRef.current) {
      try {
        await audioRef.current.play()
      } catch (error) {
        console.log("Audio playback failed:", error)
        // Fallback: try to play after a short delay
        setTimeout(async () => {
          try {
            if (audioRef.current) {
              await audioRef.current.play()
            }
          } catch (retryError) {
            console.log("Audio retry failed:", retryError)
          }
        }, 100)
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  // Wishes kanban state & handlers
  type Wish = { id: string; text: string; status: "todo" | "doing" | "done"; createdAt: number }
  const [wishes, setWishes] = useState<Wish[]>(() => {
    try {
      if (typeof window === "undefined") return []
      const raw = localStorage.getItem("wishes")
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      console.error("Failed to read wishes from localStorage:", e)
      return []
    }
  })
  const [newWish, setNewWish] = useState("")

  // persist wishes whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("wishes", JSON.stringify(wishes))
    } catch (e) {
      console.error("Failed to save wishes:", e)
    }
  }, [wishes])

  const addWish = (e: React.FormEvent) => {
    e.preventDefault()
    const txt = newWish.trim()
    if (!txt) return
    const item: Wish = { id: Date.now().toString(), text: txt, status: "todo", createdAt: Date.now() }
    setWishes((p) => [item, ...p])
    setNewWish("")
  }

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id)
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const onDropTo = (e: React.DragEvent, status: Wish["status"]) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain")
    if (!id) return
    setWishes((p) => p.map((w) => (w.id === id ? { ...w, status } : w)))
  }

  const removeWish = (id: string) => setWishes((p) => p.filter((w) => w.id !== id))
  

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 gradient-bg-1 animated-gradient -z-10"></div>

      <audio
      ref={audioRef}
      loop
      preload="auto"
      onError={(e) => console.error("Audio error:", e)}
      >
      {/* <source src="/dinda/soundDinda.mp3" type="audio/mpeg"/> */}
      </audio>

      {showSplash && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 gradient-overlay-1"></div>
        <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
          key={i}
          className="absolute w-3 h-3 rounded-full elegant-confetti floating-particles pointer-events-none"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            background: ["#fbbf24", "#f472b6", "#60a5fa", "#34d399"][i % 4],
          }}
          />
        ))}
        </div>

          <Card className="p-12 text-center max-w-md mx-4 glass-card-enhanced relative z-10">
            <div className="mb-8">
              <div className="w-20 h-20 mx-auto gradient-bg-2 rounded-full flex items-center justify-center float-animation">
                <Gift className="w-10 h-10 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-enhanced mb-4 font-[family-name:var(--font-poppins)]">
              🎉 Kejutan Spesial! 🎉
            </h1>

            <p className="text-enhanced-light mb-8 leading-relaxed">Ada sesuatu yang istimewa menunggumu di dalam...</p>

            <Button
              onClick={handleEnterSite}
              size="lg"
              className="glass-button-enhanced px-8 py-4 rounded-full relative z-20"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Klik untuk Melihat Kejutan
            </Button>
          </Card>
        </div>
      )}

      {!showSplash && (
        <>
          <Button
            onClick={toggleMute}
            variant="outline"
            size="icon"
            className="fixed top-4 right-4 z-50 glass-button-enhanced bg-transparent relative"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>

          <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 gradient-overlay-2"></div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-20 left-10 w-16 h-16 bg-amber-300 rounded-full flex items-center justify-center floating-particles opacity-30">
                <Heart className="w-8 h-8 text-amber-600" />
              </div>
              <div className="absolute top-32 right-20 w-12 h-12 bg-pink-300 rounded-full flex items-center justify-center bounce-gentle opacity-40">
                <Sparkles className="w-6 h-6 text-pink-600" />
              </div>
              <div className="absolute bottom-32 left-20 w-20 h-20 bg-blue-300 rounded-full flex items-center justify-center floating-particles opacity-35">
                <Gift className="w-10 h-10 text-blue-600" />
              </div>
              <div className="absolute bottom-20 right-10 w-14 h-14 bg-emerald-300 rounded-full flex items-center justify-center floating-particles opacity-30">
                <Heart className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="absolute top-1/2 left-1/4 w-10 h-10 bg-purple-300 rounded-full flex items-center justify-center bounce-gentle opacity-35">
                <Sparkles className="w-4 h-4 text-purple-600" />
              </div>
            </div>

            <div className="text-center z-10 px-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-enhanced mb-8 font-[family-name:var(--font-poppins)] text-balance leading-tight">
                🎂 Selamat Ulang Tahun. Dinda! 🎂
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-enhanced-light mb-12 max-w-3xl mx-auto leading-relaxed text-pretty">
                Hari ini adalah hari yang sangat istimewa, karena hari ini adalah hari kelahiranmu! yeeaay
              </p>
              <div className="flex gap-6 justify-center">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center bounce-gentle pulse-glow">
                  <span className="text-3xl">🎈</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center float-animation pulse-glow">
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center bounce-gentle pulse-glow">
                  <span className="text-3xl">🎁</span>
                </div>
              </div>
            </div>
          </section>

          <section className="py-32 px-4">
            <div className="max-w-6xl mx-auto space-y-40">
              {/* Section 1 */}
              <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-amber-200 to-pink-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <img
                    src="/dinda/3.jpg"
                    alt="Perayaan ulang tahun"
                    className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <Card className="p-10 glass-card-enhanced border-2 border-white/30 card-hover">
                  <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                    Rayakan Moment Bahagia
                  </h2>
                  <p className="text-enhanced-light leading-relaxed text-lg">
                    Setiap tahun yang berlalu adalah pencapaian luar biasa. Kamu telah tumbuh, belajar, dan menjadi
                    pribadi yang semakin menakjubkan. Hari ini, mari kita rayakan semua kebahagiaan dan kenangan indah
                    yang telah kamu ciptakan.
                  </p>
                </Card>
              </div>

              {/* Section 2 */}
              <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
                <Card className="p-10 glass-card-enhanced border-2 border-white/30 lg:order-1 card-hover">
                  <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                    Harapan dan Doa
                  </h2>
                  <p className="text-enhanced-light leading-relaxed text-lg">
                    Di hari istimewa ini, semoga semua impian dan harapanmu terwujud. Semoga berulangnya tahun yang baru ini membawa
                    kebahagiaan, kesehatan, dan kesuksesan dalam setiap langkah perjalanan hidupmu.
                  </p>
                </Card>
                <div className="lg:order-2 relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 to-blue-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <img
                    src="/dinda/10.jpg"
                    alt="Harapan ulang tahun"
                    className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* Section 3 */}
              <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <img
                    src="/dinda/14.jpg"
                    alt="Persahabatan dan perayaan"
                    className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <Card className="p-10 glass-card-enhanced border-2 border-white/30 card-hover">
                  <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                    Cerita Kita
                  </h2>
                  <p className="text-enhanced-light leading-relaxed text-lg">
                    Tulis ceritamu di sini... Kenangan indah yang telah kita lalui bersama, tawa yang kita bagikan, dan
                    momen-momen berharga yang akan selalu terukir di hati. Terima kasih telah menjadi bagian penting
                    dalam hidup ini.
                  </p>
                </Card>
              </div>

              {/* Section 4 */}
              <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
                <Card className="p-10 glass-card-enhanced border-2 border-white/30 lg:order-1 card-hover">
                  <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                    Masa Depan Cerah
                  </h2>
                  <p className="text-enhanced-light leading-relaxed text-lg">
                    Tulis harapanmu di sini... Semoga di tahun yang baru ini, kamu akan menemukan petualangan baru,
                    mencapai mimpi-mimpi yang belum terwujud, dan terus menjadi inspirasi bagi orang-orang di sekitarmu.
                  </p>
                </Card>
                <div className="lg:order-2 relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-amber-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
                  <img
                    src="/dinda/15.jpg"
                    alt="Masa depan cerah"
                    className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            

          {/* section 5 */}
          <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-emerald-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img
                src="/dinda/14.jpg"
                alt="Persahabatan dan perayaan"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <Card className="p-10 glass-card-enhanced border-2 border-white/30 card-hover">
              <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                Cerita Kita
              </h2>
              <p className="text-enhanced-light leading-relaxed text-lg">
                Tulis ceritamu di sini... Kenangan indah yang telah kita lalui bersama, tawa yang kita bagikan, dan
                momen-momen berharga yang akan selalu terukir di hati. Terima kasih telah menjadi bagian penting
                dalam hidup ini.
              </p>
            </Card>
          </div>

          <div className="fade-in grid lg:grid-cols-2 gap-16 items-center">
            <Card className="p-10 glass-card-enhanced border-2 border-white/30 lg:order-1 card-hover">
              <h2 className="text-4xl font-bold text-enhanced mb-6 font-[family-name:var(--font-poppins)] text-balance">
                Masa Depan Cerah
              </h2>
              <p className="text-enhanced-light leading-relaxed text-lg">
                Tulis harapanmu di sini... Semoga di tahun yang baru ini, kamu akan menemukan petualangan baru,
                mencapai mimpi-mimpi yang belum terwujud, dan terus menjadi inspirasi bagi orang-orang di sekitarmu.
              </p>
            </Card>
            <div className="lg:order-2 relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-emerald-200 to-amber-200 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"></div>
              <img
                src="/dinda/15.jpg"
                alt="Masa depan cerah"
                className="relative rounded-3xl shadow-2xl w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
          </div>
          </section>

          <section className="py-16 px-4 bg-gradient-to-b from-neutral-900/70 to-neutral-900/50 text-white">
            <div className="max-w-6xl mx-auto">
              <h3 className="text-3xl font-bold text-white mb-4">Ucapanmu Apa, coba sampaikan</h3>

              <form onSubmit={addWish} className="flex gap-2 mb-6">
                <input
                  value={newWish}
                  onChange={(e) => setNewWish(e.target.value)}
                  placeholder="Tulis ucapanmu di sini..."
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 text-white placeholder:text-white/60 border border-white/10"
                />
                <Button type="submit">Kirim</Button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {([
                  ["todo", "Baru"],
                  ["doing", "Dibaca"],
                  ["done", "Favorit"],
                ] as Array<[Wish["status"], string]>).map(([status, title]) => (
                  <div
                    key={status}
                    onDragOver={onDragOver}
                    onDrop={(e) => onDropTo(e, status)}
                    className="min-h-[160px] p-3 bg-black/40 rounded-lg"
                  >
                    <h4 className="font-semibold mb-2 text-white">{title}</h4>
                    <div className="space-y-3">
                      {wishes.filter((w) => w.status === status).map((w) => (
                        <Card
                          key={w.id}
                          draggable
                          onDragStart={(e) => onDragStart(e, w.id)}
                          className="p-3 bg-black/30 text-white"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <p className="text-sm text-white">{w.text}</p>
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-white/60 mt-1">{new Date(w.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 gradient-overlay-3"></div>

            {/* Background decorative elements */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-amber-200 to-pink-200 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-3xl opacity-40"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-pink-200 to-emerald-200 rounded-full blur-3xl opacity-30"></div>
            </div>

            <div className="max-w-5xl mx-auto text-center px-4 fade-in relative z-10">
              <h2 className="text-5xl md:text-6xl font-bold text-enhanced mb-12 font-[family-name:var(--font-poppins)] text-balance">
                🎊 Selamat Ulang Tahun! 🎊
              </h2>
              <p className="text-xl md:text-2xl text-enhanced-light mb-16 max-w-3xl mx-auto leading-relaxed text-pretty">
                Semoga hari ini dan setiap hari ke depannya dipenuhi dengan kebahagiaan, cinta, dan semua hal indah yang
                kamu impikan!
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-amber-300 to-amber-400 rounded-full flex items-center justify-center mx-auto mb-4 bounce-gentle pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🎂</span>
                  </div>
                  <p className="text-sm font-medium text-enhanced-light">Kue Lezat</p>
                </div>
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-300 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 float-animation pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🎈</span>
                  </div>
                  <p className="text-sm font-medium text-enhanced-light">Balon Warna-warni</p>
                </div>
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 bounce-gentle pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">🎁</span>
                  </div>
                  <p className="text-sm font-medium text-enhanced-light">Hadiah Spesial</p>
                </div>
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-br from-emerald-300 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 float-animation pulse-glow group-hover:scale-110 transition-transform duration-300">
                    <span className="text-4xl">💖</span>
                  </div>
                  <p className="text-sm font-medium text-enhanced-light">Cinta & Kasih</p>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
