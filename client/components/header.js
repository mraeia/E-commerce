import Link from "next/link";

const Header = ({ currentUser }) => {
  return (
    <div>
      <Link href="/">
        <a>E-com</a>
      </Link>
    </div>
  );
};

export default Header;
