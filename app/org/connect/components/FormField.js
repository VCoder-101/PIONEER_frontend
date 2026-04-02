import { Label } from "@/componentsShadCN/ui/label";

const FormField = ({ label, required, error, touched, children, name }) => {
  const showError = touched && error;
  
  return (
    <Label className='flex mb-2'>
      <span className={`text-left mr-2 w-[88px] ${required ? 'after:ml-0.5 after:text-red-500 after:content-["*"]' : ''}`}>
        {label}
      </span>
      <div className="flex-1">
        {children}
        {showError && (
          <p className="text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </Label>
  );
};

export default FormField