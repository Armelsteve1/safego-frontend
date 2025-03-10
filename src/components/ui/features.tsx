"use client";

import { FiMapPin, FiShield, FiThumbsUp } from "react-icons/fi";

export default function Features() {
  const features = [
    {
      icon: <FiMapPin size={22} className="text-[#919191]" />,
      title: "Tous vos trajets en une seule application",
      description:
        "Accédez à une plateforme centralisée pour planifier, réserver et gérer tous vos déplacements avec facilité.",
    },
    {
      icon: <FiShield size={22} className="text-[#919191]" />,
      title: "Voyagez en toute confiance",
      description:
        "Nous prenons le temps de valider chaque utilisateur afin d'assurer votre sécurité lors de chaque trajet.",
    },
    {
      icon: <FiThumbsUp size={22} className="text-[#919191]" />,
      title: "Facilité d'utilisation",
      description:
        "Recherchez, cliquez, réservez. Notre interface intuitive rend la planification de vos voyages simple et rapide.",
    },
  ];

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-8">Pourquoi SafeGo ?</h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 flex-1 flex flex-col items-center"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
