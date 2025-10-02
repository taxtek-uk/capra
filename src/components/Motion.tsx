import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

export const FadeIn = ({ children, delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const ScaleIn = ({ children, delay = 0, ...props }: HTMLMotionProps<'div'> & { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay }}
    {...props}
  >
    {children}
  </motion.div>
);

export const SlideIn = ({ children, direction = 'left', delay = 0 }: { children: ReactNode; direction?: 'left' | 'right' | 'up'; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? -30 : 30 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
  >
    {children}
  </motion.div>
);
