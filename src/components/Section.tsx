import { ReactNode } from 'react';
import { Container } from './Container';
import { FadeIn } from './Motion';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}

export const Section = ({ children, className = '', containerClassName = '', id }: SectionProps) => {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <Container className={containerClassName}>
        <FadeIn>
          {children}
        </FadeIn>
      </Container>
    </section>
  );
};
