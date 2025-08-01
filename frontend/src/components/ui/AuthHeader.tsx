interface AuthHeaderProps {
  icon: string;
  title: string;
  subtitle: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function AuthHeader({ 
  icon, 
  title, 
  subtitle, 
  gradientFrom = "indigo-500", 
  gradientTo = "purple-600" 
}: AuthHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className={`w-16 h-16 bg-gradient-to-br from-${gradientFrom} to-${gradientTo} rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl`}>
        {icon}
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
}