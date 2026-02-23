import portfolioCardImage from '../assets/images/projects/homepp.jpg';
import sumoSimulationImage from '../assets/images/projects/sumo_simulation_gui.png';

export const baseProjects = [
    {
        slug: "personal-portfolio",
        titleKey: "projectDetails.personal-portfolio.title",
        descriptionKey: "projectDetails.personal-portfolio.description",
        technologies: ["React.js", "Vite", "Tailwind CSS", "HTML5", "CSS3", "JavaScript", "Canvas API", "Git"],
        githubUrl: "https://github.com/Kaesar515/personal-portfolio",
        image: portfolioCardImage
    },
    {
        slug: "traffic-simulation",
        titleKey: "projectDetails.traffic-simulation.title",
        descriptionKey: "projectDetails.traffic-simulation.description",
        technologies: ["Java", "SUMO", "TraCI API", "OOP", "Concurrency", "Git"],
        githubUrl: "https://github.com/lilsemy/SUMO_Group4",
        image: sumoSimulationImage
    }
];
