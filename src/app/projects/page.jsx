"use client"

import { useState } from "react"
import { projectData } from "@/lib/projects"
import { Globe, Gamepad2, Server, Wrench, AppWindow, LayoutGrid, Download, Github, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const icons = {
  "All": <LayoutGrid className="w-4 h-4 mr-1" />,
  "Web": <Globe className="w-4 h-4 mr-1" />,
  "Games": <Gamepad2 className="w-4 h-4 mr-1" />,
  "Backend & Systems": <Server className="w-4 h-4 mr-1" />,
  "Tools & Config": <Wrench className="w-4 h-4 mr-1" />,
  "Applications": <AppWindow className="w-4 h-4 mr-1" />,
};

export function CardImage({ image, badge, title, desc, tech, github, live, download }) {
  return (
    <Card className="relative mx-auto w-full pt-0 flex flex-col h-full overflow-hidden">
      <div className="absolute inset-0 z-40 aspect-video bg-black/10" />
      <img
        src={image}
        alt={title}
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className="shrink-0">{badge}</Badge>
        </div>
        <CardDescription className="w-full min-w-0">
          {desc}
        </CardDescription>
      </CardHeader>
      <div className="mt-auto px-4 flex flex-wrap gap-2">
        {tech && tech.map((skill, index) => (
          <Badge key={index} variant="outline" className="text-xs font-normal">
            {skill}
          </Badge>
        ))}
      </div>
      <CardFooter className="flex gap-4 pt-4 border-t border-border/50">
        {github && (
          <Button variant="outline" className="flex-1" asChild>
            <a href={github} target="_blank" rel="noreferrer">
              <Github className="w-4 h-4 mr-1" />Github</a>
          </Button>
        )}

        {live && (
          <Button className="flex-1" asChild>
            <a href={live} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4 mr-1" />Visit</a>
          </Button>
        )}

        {download && (
          <Button className="flex-1" asChild>
            <a href={download} target="_blank" rel="noreferrer">
              <Download className="w-4 h-4 mr-1" />Download</a>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export default function Projects() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...new Set(projectData.map(item => item.category))];
  const filteredProjects = filter === "All"
    ? projectData
    : projectData.filter(project => project.category === filter);
  return (
    <main>
      <section id="projects" className="max-w-8xl mx-auto p-12">
        <div className="mb-6 text-center md:text-left">
          <span className="text-primary font-semibold tracking-wider text-sm">THE ARCHIVE</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">My Projects</h2>
          <p className="text-muted-foreground mt-4 mx-auto md:mx-0">
            A collection of things I've built, ranging from web applications to configurations and games.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10 justify-center md:justify-start">
          {categories.map((category) => (
            <Button
              key={category}
              variant={filter === category ? "default" : "outline"}
              onClick={() => setFilter(category)}
              className="rounded-full"
            >
              {icons[category]}
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {filteredProjects.map((project) => (
            <CardImage
              key={project.id}
              image={project.image}
              badge={project.category}
              title={project.title}
              desc={project.desc}
              tech={project.tech}
              github={project.github}
              live={project.live}
              download={project.download}
            />
          ))}
        </div>
      </section>
    </main >
  )
}
