import { PropsWithChildren } from "react";
import stlyes from "./styles.module.scss";

export const AdaptiveContainer = ({children}: PropsWithChildren) => {
  return (
    <div className={stlyes.adaptiveContainer}>
      {children}
    </div>
  )
}