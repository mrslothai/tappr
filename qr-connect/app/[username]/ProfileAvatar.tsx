'use client'

import { useState } from 'react'

export default function ProfileAvatar({
  src,
  name,
}: {
  src: string | null
  name: string
}) {
  const [failed, setFailed] = useState(false)
  const initial = name?.charAt(0)?.toUpperCase() || '?'

  if (!src || failed) {
    return (
      <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-xl flex items-center justify-center text-white text-5xl font-bold">
        {initial}
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500 shadow-xl object-cover"
      onError={() => setFailed(true)}
    />
  )
}
