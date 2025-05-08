import styles from "./Header.module.css";

export default function Header({ children, className }) {
  return <header className={`${styles.header} ${className}`}>{children}</header>;
}
