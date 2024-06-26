
interface AuthProps {
  children: React.ReactNode;
};

const AuthProvider = (props: AuthProps): React.ReactElement | any => {
  return (
    <div className="boots">
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 800,
          height: 800,
          background: "red"
        }}>

        </div>
       {props.children}
    </div>
  );
};

export default AuthProvider;