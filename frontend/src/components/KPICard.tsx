import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface KPICardProps {
  title: string
  value: number | string
  trend: string
  positive?: boolean
  icon: ReactNode
}

export default function KPICard({
  title,
  value,
  trend,
  positive = true,
  icon,
}: KPICardProps) {
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02
      }}
      className="
      bg-white
      rounded-2xl
      p-6
      shadow-sm
      border
      border-slate-100
      hover:shadow-lg
      transition-all
      duration-300
      cursor-pointer
      "
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2 text-slate-800">
            {value}
          </h2>

          <p
            className={`mt-3 text-sm font-medium ${
              positive
                ? 'text-green-600'
                : 'text-red-600'
            }`}
          >
            {trend}
          </p>
        </div>

        <div
          className="
          h-12
          w-12
          rounded-xl
          bg-blue-50
          flex
          items-center
          justify-center
          "
        >
          {icon}
        </div>
      </div>
    </motion.div>
  )
}
