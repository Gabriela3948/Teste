import { AbsoluteFill, Composition, interpolate, useCurrentFrame } from "remotion";

type Props = {
  readonly titulo: string;
};

export const MyComposition = () => {
  return (
    <Composition
      id="PrimeiroProjeto"
      component={PrimeiroProjeto}
      durationInFrames={150}
      fps={30}
      width={1080}
      height={1920}
      defaultProps={{ titulo: "Meu primeiro projeto" }}
    />
  );
};

export const PrimeiroProjeto: React.FC<Props> = ({ titulo }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#14111f",
        justifyContent: "center",
        alignItems: "center",
        padding: 100,
      }}
    >
      <h1
        style={{
          color: "#ffffff",
          fontFamily: "Helvetica, Arial, sans-serif",
          fontSize: 110,
          fontWeight: 700,
          lineHeight: 1.1,
          textAlign: "center",
          margin: 0,
          opacity,
        }}
      >
        {titulo}
      </h1>
    </AbsoluteFill>
  );
};
