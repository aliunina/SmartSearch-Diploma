import "./Footer.css";

export default function Footer({ className }) {
  return (
    <footer className={`footer ${className ? className : ""}`}>
      <div>&copy; Aliunina Polina 2025</div>
    </footer>
  );
}
