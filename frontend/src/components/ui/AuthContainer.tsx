interface AuthContainerProps {
  children: React.ReactNode;
  gradientFrom?: string;
  gradientTo?: string;
}

export default function AuthContainer({ 
  children, 
  gradientFrom = "indigo-500", 
  gradientTo = "purple-600" 
}: AuthContainerProps) {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-${gradientFrom} to-${gradientTo} flex items-center justify-center p-5`}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        {children}
      </div>
    </div>
  );
}