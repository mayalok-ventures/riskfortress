import { motion, type MotionProps } from 'framer-motion'

type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>
type MotionSpanProps = MotionProps & React.HTMLAttributes<HTMLSpanElement>
type MotionPProps = MotionProps & React.HTMLAttributes<HTMLParagraphElement>
type MotionH1Props = MotionProps & React.HTMLAttributes<HTMLHeadingElement>
type MotionH2Props = MotionProps & React.HTMLAttributes<HTMLHeadingElement>
type MotionH3Props = MotionProps & React.HTMLAttributes<HTMLHeadingElement>
type MotionSectionProps = MotionProps & React.HTMLAttributes<HTMLElement>
type MotionUlProps = MotionProps & React.HTMLAttributes<HTMLUListElement>
type MotionLiProps = MotionProps & React.HTMLAttributes<HTMLLIElement>
type MotionButtonProps = MotionProps & React.ButtonHTMLAttributes<HTMLButtonElement>
type MotionAProps = MotionProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
type MotionImgProps = MotionProps & React.ImgHTMLAttributes<HTMLImageElement>
type MotionSvgProps = MotionProps & React.SVGAttributes<SVGSVGElement>
type MotionPathProps = MotionProps & React.SVGAttributes<SVGPathElement>

export const MotionDiv = motion.div as React.FC<MotionDivProps>
export const MotionSpan = motion.span as React.FC<MotionSpanProps>
export const MotionP = motion.p as React.FC<MotionPProps>
export const MotionH1 = motion.h1 as React.FC<MotionH1Props>
export const MotionH2 = motion.h2 as React.FC<MotionH2Props>
export const MotionH3 = motion.h3 as React.FC<MotionH3Props>
export const MotionSection = motion.section as React.FC<MotionSectionProps>
export const MotionUl = motion.ul as React.FC<MotionUlProps>
export const MotionLi = motion.li as React.FC<MotionLiProps>
export const MotionButton = motion.button as React.FC<MotionButtonProps>
export const MotionA = motion.a as React.FC<MotionAProps>
export const MotionImg = motion.img as React.FC<MotionImgProps>
export const MotionSvg = motion.svg as React.FC<MotionSvgProps>
export const MotionPath = motion.path as React.FC<MotionPathProps>
