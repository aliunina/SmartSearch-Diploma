import "./Help.css";

import Button from "../../components/inputs/Button/Button";

import { Link, useNavigate } from "react-router-dom";
import Header from "../../layouts/CommonLayout/Header/Header";
import Footer from "../../layouts/CommonLayout/Footer/Footer";
import Logo from "../../components/visuals/Logo/Logo";
import { useContext } from "react";
import { UserContext } from "../../contexts/UserContext/UserContext";
import { showErrorMessageToast } from "../../helpers/util";

export default function Help() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL;
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const navBack = () => {
    navigate(-1);
  };

  const navToProfileOrSignIn = () => {
    if (user === null) {
      showErrorMessageToast("Сначала необходимо войти или зарегистрироваться");
      navigate("/sign-in", {
        state: {
          navBack: true
        }
      });
    } else {
      navigate("/my-profile");
    }
  };

  return (
    <>
      <Header />
      <div className="help-page-body">
        <div className="help-page-logo-container">
          <Button
            className="accent-button help-page-back-button"
            onClick={navBack}
          >
            Назад
          </Button>
          <Logo className="help-page-logo" />
        </div>
        <section className="help-page-section">
          <h2>О сайте</h2>
          <p className="help-page-text">
            &nbsp;&nbsp;&nbsp;Данный веб-сайт предназначен для поиска и
            автоматической рассылки научно-методической информации, актуальной
            для студентов и преподавателей БНТУ. Система позволяет быстро
            находить статьи, публикации и другие материалы из доверенных
            источников, таких как репозиторий БНТУ, Лань, ЛитРес и др.
          </p>
        </section>
        <section className="help-page-section">
          <h2>Преимущества сайта</h2>
          <ul className="help-page-text">
            <li>
              <strong>Автоматическая рассылка:</strong> вам больше не нужно
              вручную искать обновления — система сама пришлёт подборку новых
              публикаций по выбранным темам.
            </li>
            <li>
              <strong>Только проверенные источники:</strong> поиск
              осуществляется только по доверенным ресурсам, включая репозиторий
              БНТУ, ЛитРес и Лань.
            </li>
            <li>
              <strong>Удобный интерфейс:</strong> простая навигация, быстрый
              доступ к нужной информации и возможность сохранить материалы.
            </li>
            <li>
              <strong>Безопасность:</strong> данные пользователей надёжно
              защищены, все пароли и токены хранятся в зашифрованном виде.
            </li>
            <li>
              <strong>Адаптирован под БНТУ:</strong> сайт разработан с учётом
              структуры и потребностей учебного заведения.
            </li>
          </ul>
        </section>
        <section className="help-page-section">
          <h2>Как пользоваться сайтом</h2>
          <ul className="help-page-text">
            <li>
              <Link to="/sign-up" className="help-page-link">
                <strong>Регистрация:</strong>
              </Link>{" "}
              пройдите простую регистрацию, указав свою электронную почту и
              интересующие темы.
            </li>
            <li>
              <Link to="/sign-in" className="help-page-link">
                <strong>Вход в систему:</strong>
              </Link>{" "}
              используйте e-mail и пароль, чтобы получить доступ к своему
              профилю.
            </li>
            <li>
              <Link to="/search?q=Механика" className="help-page-link">
                <strong>Поиск информации:</strong>
              </Link>{" "}
              воспользуйтесь поисковой строкой и фильтрами для подбора нужных
              материалов.
            </li>
            <li>
              <a onClick={navToProfileOrSignIn} className="help-page-link">
                <strong>Профиль:</strong>
              </a>{" "}
              здесь вы можете увидеть сохраненные статьи из поиска, а также
              новые публикации по интересующим темам.
            </li>
            <li>
              <strong>Уведомления:</strong> дважды в месяц вы будете получать
              подборку новых публикаций на почту по выбранным темам; 
              редактировать интересующие темы можно в профиле.
            </li>
          </ul>
        </section>

        <section className="help-page-section">
          <h2>Поддержка</h2>
          <p className="help-page-text">
            &nbsp;&nbsp;&nbsp;Если у вас возникли вопросы или проблемы в работе
            с сайтом, вы можете обратиться в Научную библиотеку БНТУ или
            связаться с технической поддержкой по адресу{" "}
            <a className="help-page-link" href={`mailto:${supportEmail}`}>
              {supportEmail}
            </a>
          </p>
        </section>
      </div>
      <Footer />
    </>
  );
}
