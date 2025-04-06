
import { CourseData, ScrapingConfig } from "@/types";

export const sampleConfigs: ScrapingConfig[] = [
  {
    id: "config-1",
    name: "Generic Course Provider",
    description: "Configuration for standard course listing websites",
    baseUrl: "https://example-courses.com",
    selectors: {
      title: ".course-title",
      description: ".course-description",
      startDate: ".course-date",
      duration: ".course-duration",
      cost: ".course-price",
      subsidized: ".subsidized-badge",
      url: "a.course-link",
      imageUrl: ".course-image img"
    }
  },
  {
    id: "config-2",
    name: "Advanced Training Portal",
    description: "For sites with complex nested structures",
    baseUrl: "https://advancedtraining.com",
    selectors: {
      title: "h3.training-title",
      description: "div.training-details p",
      startDate: "span.start-date",
      duration: "span.duration",
      cost: ".pricing-info .amount",
      subsidized: ".funding-badge",
      url: ".card-wrapper a",
      imageUrl: ".training-thumbnail img"
    },
    transformers: {
      cost: "price => price.replace('€', '').trim() + ' €'",
      subsidized: "badge => badge !== null"
    }
  },
  {
    id: "config-3",
    name: "Formación Bonificada España",
    description: "Específico para sitios de formación bonificada en España",
    baseUrl: "https://formacion-bonificada.es",
    selectors: {
      title: ".curso-titulo",
      description: ".curso-descripcion",
      startDate: ".fecha-inicio",
      duration: ".duracion-curso",
      cost: ".precio-curso",
      subsidized: ".curso-bonificable",
      url: ".enlace-curso",
      imageUrl: ".imagen-curso"
    },
    transformers: {
      subsidized: "el => el !== null && el.textContent.includes('Bonificable')"
    }
  }
];

export const mockCourseData: CourseData[] = [
  {
    title: "Desarrollo web con React",
    description: "Aprende a desarrollar aplicaciones web modernas con React. Este curso te enseñará desde los fundamentos hasta técnicas avanzadas de desarrollo frontend.",
    startDate: "15/05/2023",
    duration: "60 horas",
    cost: "500 €",
    subsidized: true,
    url: "https://example.com/cursos/desarrollo-web-react"
  },
  {
    title: "Python para Análisis de Datos",
    description: "Curso completo de Python orientado al análisis y procesamiento de datos. Incluye pandas, numpy, matplotlib y scikit-learn.",
    startDate: "22/06/2023",
    duration: "80 horas",
    cost: "750 €",
    subsidized: true,
    url: "https://example.com/cursos/python-analisis-datos"
  },
  {
    title: "Marketing Digital Avanzado",
    description: "Domina las estrategias más efectivas de marketing digital: SEO, SEM, redes sociales, email marketing y analítica web.",
    startDate: "10/07/2023",
    duration: "40 horas",
    cost: "450 €",
    subsidized: true,
    url: "https://example.com/cursos/marketing-digital-avanzado"
  },
  {
    title: "Inteligencia Artificial y Machine Learning",
    description: "Introducción a los conceptos y aplicaciones de la IA y el aprendizaje automático. Aprenderás a diseñar, entrenar y evaluar modelos de ML.",
    startDate: "05/09/2023",
    duration: "100 horas",
    cost: "950 €",
    subsidized: false,
    url: "https://example.com/cursos/ia-machine-learning"
  },
  {
    title: "Excel para Negocios",
    description: "Aprende a utilizar Microsoft Excel para análisis de datos empresariales, tablas dinámicas, fórmulas avanzadas y automatización con macros.",
    startDate: "12/04/2023",
    duration: "30 horas",
    cost: "300 €",
    subsidized: true,
    url: "https://example.com/cursos/excel-negocios"
  },
  {
    title: "Gestión de Proyectos con Metodologías Ágiles",
    description: "Aprende a implementar Scrum, Kanban y otras metodologías ágiles para la gestión eficiente de proyectos en entornos cambiantes.",
    startDate: "20/08/2023",
    duration: "50 horas",
    cost: "550 €",
    subsidized: true,
    url: "https://example.com/cursos/gestion-proyectos-agile"
  }
];
