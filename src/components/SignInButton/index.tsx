import { FaGithub } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { signIn, useSession, signOut } from "next-auth/client";

import styles from "./styles.module.scss";

export const SignInButton = () => {
  const [session] = useSession();

  return session ? (
    <button onClick={() => signOut()} className={styles.signInButton}>
      <FaGithub color='#04d361' />
      {session.user.name}
      <FiX color='#737380' className={styles.closeIcon} />
    </button>
  ) : (
    <button onClick={() => signIn("github")} className={styles.signInButton}>
      <FaGithub color='#eba417' />
      Sing in with Github
    </button>
  );
};
