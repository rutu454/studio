import SectionWrapper from '../common/SectionWrapper';
import { Banknote } from 'lucide-react';

const BankDetailsSection = () => {
  return (
    <SectionWrapper className="bg-primary/90">
      <div className="text-center max-w-2xl mx-auto text-primary-foreground">
        <h2 className="text-3xl font-bold mb-6 flex items-center justify-center gap-2">
          <Banknote className="w-8 h-8" />
          Bank Details
        </h2>
        <div className="bg-background/20 backdrop-blur-sm rounded-lg p-6 text-left space-y-4 text-lg">
            <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-semibold col-span-1">Name</span>
                <span className="col-span-2">: PRASTHAN GROUP</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-semibold col-span-1">Bank</span>
                <span className="col-span-2">: HDFC Bank</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-semibold col-span-1">Ac. No.</span>
                <span className="col-span-2">: 50200003515810</span>
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
                <span className="font-semibold col-span-1">IFSC code</span>
                <span className="col-span-2">: HDFC0000231</span>
            </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default BankDetailsSection;
