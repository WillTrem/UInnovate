import { describe, expect } from "vitest";
import {
  ConfigProvider,
  ConfigValueType,
  useConfig,
} from "../../contexts/ConfigContext";
import { fireEvent, render, screen } from "@testing-library/react";

const newConfigValueMock: ConfigValueType = {
  property: "propertyMock",
  value: "valueMock",
};
const ConfigContextMockComponent = () => {
  const { config, updateConfig } = useConfig();

  return (
    <div>
      <div>
        Config:{" "}
        {config?.map((value) => (
          <span>{value.value}</span>
        ))}
      </div>
      <button onClick={() => updateConfig(newConfigValueMock)}>
        Update Config
      </button>
    </div>
  );
};
vi.mock("axios");
describe("ConfigContext", () => {
  it("provides the context value", () => {
    render(
      <ConfigProvider>
        <ConfigContextMockComponent />
      </ConfigProvider>
    );
  }),
    it("inserts a new config value in the config state", async () => {
      // Arrange
      render(
        <ConfigProvider>
          <ConfigContextMockComponent />
        </ConfigProvider>
      );

      // Assert: there shouldn't be any config values with the value 'valueMock' in the config
      const spanElements = screen.queryAllByText(newConfigValueMock.value);
      expect(spanElements.length).toBe(0);

      // Act: Calls the updateConfig function with the newConfigValueMock object as parameter
      fireEvent.click(screen.getByRole("button"));

      // Assert: a config value with value 'valueMock' should have been added to the config
      const configValues = await screen.findAllByText(newConfigValueMock.value);
      expect(configValues.length).toBeGreaterThan(0);
    }),
    it("updates an already existing value in the config", async () => {
      // Arrange
      render(
        <ConfigProvider>
          <ConfigContextMockComponent />
        </ConfigProvider>
      );

      // Act: Calls the updateConfig function with the newConfigValueMock object as parameter
      fireEvent.click(screen.getByRole("button"));

      // Assert: a config value with value 'valueMock' should have been added to the config
      const spanElements = await screen.findAllByText(newConfigValueMock.value);
      expect(spanElements.length).toBe(1);

      // Act: Calls the updateConfig function with the newConfigValueMock object as parameter
      fireEvent.click(screen.getByRole("button"));

      // Assert: the value should've been only updated, no new entry should have been added
      const configValues = await screen.findAllByText(newConfigValueMock.value);
      expect(configValues.length).toBe(1);
    }),
    it("throws an error if the useConfig hook is used without the ConfigProvider", () => {
      // Assert
      expect(() => render(<ConfigContextMockComponent />)).toThrowError();
    });
});
