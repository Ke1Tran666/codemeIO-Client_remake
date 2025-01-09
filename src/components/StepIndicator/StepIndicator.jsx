import PropTypes from 'prop-types';

const StepIndicator = ({ currentStep }) => {
    const steps = [
        { number: 1, title: 'Nhập Email' },
        { number: 2, title: 'Xác thực OTP' },
        { number: 3, title: 'Đặt lại mật khẩu' }
    ];

    const getStepStatus = (index) => {
        if (currentStep === 'email') return index === 0 ? 'current' : 'upcoming';
        if (currentStep === 'otp') return index === 0 ? 'completed' : index === 1 ? 'current' : 'upcoming';
        if (currentStep === 'password') return index <= 1 ? 'completed' : index === 2 ? 'current' : 'upcoming';
    };

    const getLineWidth = (index) => {
        if (currentStep === 'email') return '0%';
        if (currentStep === 'otp' && index === 0) return '100%';
        if (currentStep === 'password' && index === 0) return '100%';
        if (currentStep === 'password' && index === 1) return '100%';
        return '0%';
    };

    return (
        <div className="flex justify-between items-center mb-8 w-full">
            {steps.map((step, index) => {
                const status = getStepStatus(index);
                return (
                    <div key={step.number} className="flex flex-col items-center relative w-1/3">
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 text-sm font-medium
                                ${status === 'completed' ? 'bg-[#1089d3] text-white' :
                                    status === 'current' ? 'bg-[#1089d3] text-white' :
                                        'bg-gray-200 text-gray-500'}`}
                        >
                            {step.number}
                        </div>
                        <p className={`text-xs font-medium 
                            ${status === 'completed' ? 'text-[#1089d3]' :
                                status === 'current' ? 'text-[#1089d3]' :
                                    'text-gray-500'}`}
                        >
                            {step.title}
                        </p>
                        {index < steps.length - 1 && (
                            <div className="absolute top-4 left-1/2 w-full h-[2px] bg-gray-200 -z-10">
                                <div
                                    style={{ width: getLineWidth(index) }}
                                    className={`h-full bg-[#1089d3] transition-all duration-500 ease-in-out`}
                                />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

StepIndicator.propTypes = {
    currentStep: PropTypes.string.isRequired,
};

export default StepIndicator;