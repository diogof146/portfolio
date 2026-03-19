import { Card } from "@/components/ui/card"
import { Server, Layout, Wrench, Gamepad2 } from "lucide-react"

export default function Skills() {
  return (
    <section id="skills" className="py-24 max-w-7xl mx-auto px-6">

      <div className="mb-10 text-center md:text-left">
        <span className="text-primary font-semibold tracking-wider text-sm">Skills</span>
        <h2 className="text-3xl md:text-4xl font-bold mt-2">Tech Stack</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">

        <Card className="p-6 shadow-sm border-border/50 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Server className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Backend & Systems</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Java, Spring Boot, Spring Security, MySQL, Node.js, Python, and C.
          </p>
        </Card>

        <Card className="p-6 shadow-sm border-border/50 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Layout className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Frontend Development</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            React, Next.js, Tailwind CSS, JavaScript, and HTML.
          </p>
        </Card>

        <Card className="p-6 shadow-sm border-border/50 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Wrench className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Tools & Workflow</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Git, GitHub, Unix/Linux Environments, Bash Scripting, Lua, and Neovim.
          </p>
        </Card>

        <Card className="p-6 shadow-sm border-border/50 hover:shadow-md transition-all">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Gamepad2 className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold mb-3">Games & Applications</h3>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Unity, C#, Swift and Blender.
          </p>
        </Card>

      </div>
    </section>
  )
}
