import { useEnableCookies } from "./useEnableCookies";

export const App = () => {
  const websiteName = "Example.com"; // Change here
  const {
    enablementStep,
    enablementFailed,
    onClickOpen,
    onClickWhitelist,
    onClickEnable,
  } = useEnableCookies({
    onEnabled: () => {
      location.href = "https://example.com"; // Change here
    },
  });

  if (enablementStep === undefined) return <>Loading...</>;

  return (
    <>
      <h1>To use {websiteName}, enable cookies</h1>
      {enablementFailed && (
        <div style={{ color: "red" }}>
          Failed to enable cookies. Let's try again.
        </div>
      )}
      <Step step={1} currentStep={enablementStep} name={`Open ${websiteName}`}>
        <button onClick={onClickOpen}>Open</button>
      </Step>
      <Step
        step={2}
        currentStep={enablementStep}
        name={`Whitelist ${websiteName}`}
      >
        <button onClick={onClickWhitelist}>Whitelist</button>
      </Step>
      <Step
        step={3}
        currentStep={enablementStep}
        name={`Enable cookies for ${websiteName}`}
      >
        <button onClick={onClickEnable}>Enable Cookies</button>
      </Step>
    </>
  );
};

const Step = ({
  step,
  currentStep,
  name,
  children,
}: {
  step: number;
  currentStep: number;
  name: string;
  children: React.ReactNode;
}) => {
  return (
    <div>
      <div
        style={
          currentStep < step
            ? { opacity: 0.3 }
            : currentStep > 0
              ? { color: "green", opacity: 0.5 }
              : undefined
        }
      >
        {step}. {name}
      </div>
      {currentStep === step && children}
    </div>
  );
};
