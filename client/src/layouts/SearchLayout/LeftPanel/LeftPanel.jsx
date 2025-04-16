import styles from "./LeftPanel.module.css";

export default function LeftPanel({ children, className }) {
  return <div className={`${styles["left-panel"]} ${className}`}>{children}</div>;
}
