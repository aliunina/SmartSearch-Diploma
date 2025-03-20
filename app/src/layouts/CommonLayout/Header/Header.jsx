import styles from "./Header.module.css";

export default function Header({ children, className }) {
  return <div className={`${styles.header} ${className}`}>{children}</div>;
}
