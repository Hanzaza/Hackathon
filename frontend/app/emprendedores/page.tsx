
import { Metadata } from "next";
import Carousel from "./components/Carousel";
import Section from "./components/Section";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Emprendedores",
};

export default function EmprendedoresPage() {
  return (
    <div className="bg-gray-50 text-gray-800 pt-4 lg:pt-24 pb-32">
      <Section title="Bienvenidos a la sección de Emprendedores">
        <p className="text-center mb-8">
          Un espacio para inspirarte, aprender y conectar con el ecosistema
          emprendedor de Nicaragua.
        </p>
        <Carousel />
      </Section>

      <Section title="Descarga la Guía del Emprendedor" className="bg-white">
        <div className="flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm text-center">
            <Image
              src="/emprendedores/guia-emprendedor-caratula.jpg"
              alt="Portada de la Guía del Emprendedor"
              width={300}
              height={400}
              className="mx-auto mb-4"
            />
            <h3 className="text-2xl font-semibold mb-4">
              Guía del Emprendedor 2021
            </h3>
            <p className="text-gray-600 mb-6">
              Todo lo que necesitas saber para iniciar tu propio negocio en
              Nicaragua.
            </p>
            <a
              href="/emprendedores/Guia-del-Emprendedor-2021.pdf"
              download
              className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Descargar Guía
            </a>
          </div>
        </div>
      </Section>

      <Section title="Nicaragua Emprende: Impulsando el Futuro">
        <div className="text-center space-y-4">
          <p>
            Aquí te daremos las últimas noticias de <strong>Nicaragua Emprende</strong>, una plataforma
            diseñada para incentivar la promoción y comercialización del
            emprendimiento joven de Nicaragua, fomentando el desarrollo y
            crecimiento de jóvenes emprendedores de todos los sectores, en todo
            el país.
          </p>
          <p>
            Promueve la formalización, gestión y procesos a través de la ruta
            emprendedora, donde especialistas de las diferentes instituciones
            del GRUN, brindan asesorías y atención a las consultas de los
            protagonistas.
          </p>
          <p>
            Es organizada a través de las siguientes instituciones: MEFCCA,
            INATEC, MIFIC, INTUR, CNU, Secretaría de Economía Creativa, canal 8,
            INIFOM (gobiernos locales).
          </p>
          <p>
            Inicio a partir del año 2018. A través de esta plataforma se
            realizan ferias departamentales y nacional, concursos, asesorías,
            talleres y capacitaciones en temas especializados para cada sector,
            así como intercambios de experiencias y promoción de las nuevas
            tecnologías.
          </p>
        </div>
      </Section>
    </div>
  );
}
