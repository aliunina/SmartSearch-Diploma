import styles from "./LeftPanel.module.css";

export default function LeftPanel({ children }) {
  return <div className={styles["left-panel"]}>{children}</div>;
}
