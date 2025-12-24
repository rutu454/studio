// import * as React from "react";
// import { cn } from "@/lib/utils";

// interface SectionWrapperProps extends React.HTMLAttributes<HTMLElement> {
//   children: React.ReactNode;
// }

// const SectionWrapper = ({
//   children,
//   className,
//   id,
//   ...props
// }: SectionWrapperProps) => {
//   return (
//     <section id={id} className={cn("py-20 sm:py-24", className)} {...props}>
//       <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
//         {children}
//       </div>
//     </section>
//   );
// };

// export default SectionWrapper;
'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type SectionWrapperProps = {
  children: React.ReactNode;
  className?: string;
  id:string;
};

const SectionWrapper = forwardRef<HTMLDivElement, SectionWrapperProps>(
  ({ children, className, id }, ref) => {
    return (
      <section
        ref={ref}
        className={cn(
          'px-4 sm:px-6 lg:px-20 ',
          className,
          id
        )}
      >
        {children}
      </section>
    );
  }
);

SectionWrapper.displayName = 'SectionWrapper';

export default SectionWrapper;
