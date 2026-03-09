import Link from 'next/link'
import Image from 'next/image'

interface RoleBoxProps {
  href: string
  icon: string
  role: string
  description: string
}

export default function RoleBox({ href, icon, role, description }: RoleBoxProps) {
  return (
    <Link href={href} className="user-box group">
      <div className="flex items-center gap-4">
        <div className="blue-circle-icon-ghost group-hover:bg-blue-600  transition-colors duration-200">
          <Image
            src={icon}
            alt={role}
            width={16}
            height={16}
            className="brightness-0 group-hover:invert transition-all duration-200"
          />
        </div>
        <div className="text-left">
          <div className="user-role">{role}</div>
          <div className="text-[13px] text-gray-500">{description}</div>
        </div>
      </div>
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Image src="/icons/arrow-right.png" alt="Arrow" width={16} height={16} />
      </div>
    </Link>
  )
}