"use client"

import { useEffect, useRef } from "react"

export default function UltimateEffects() {

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")!
    let particles: any[] = []
    let mouse = { x: 0, y: 0 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener("resize", resize)

    // 🧠 create particles
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2,
      })
    }

    // 🖱 mouse tracking
    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    })

    const draw = () => {

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {

        // physics move
        p.x += p.vx
        p.y += p.vy

        // bounce
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1

        // distance to mouse
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 120) {
          p.x -= dx * 0.01
          p.y -= dy * 0.01
        }

        // draw particle
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(99,102,241,0.7)"
        ctx.fill()

      })

      requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener("resize", resize)
    }

  }, [])

  // 🖱 cursor glow
  useEffect(() => {

    const glow = document.createElement("div")

    glow.style.position = "fixed"
    glow.style.width = "200px"
    glow.style.height = "200px"
    glow.style.borderRadius = "50%"
    glow.style.pointerEvents = "none"
    glow.style.background = "radial-gradient(circle, rgba(99,102,241,0.25), transparent 60%)"
    glow.style.transform = "translate(-50%, -50%)"
    glow.style.zIndex = "9999"
    glow.style.mixBlendMode = "screen"

    document.body.appendChild(glow)

    const move = (e: MouseEvent) => {
      glow.style.left = e.clientX + "px"
      glow.style.top = e.clientY + "px"
    }

    window.addEventListener("mousemove", move)

    return () => {
      window.removeEventListener("mousemove", move)
      document.body.removeChild(glow)
    }

  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  )
}