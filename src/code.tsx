import { Languages, colorlize, parse, selectTheme } from "web-code-color";

export function createCode(text: string) {
  const parsed = parse(text, Languages.EcmaScript);
  const [colored, bg] = colorlize(parsed, selectTheme(""));
  const e = (
    <pre>
      <code>
        {colored.map(({ value: color, text }, key) => {
          return (
            <span
              style={{ color }}
              key={key}
              className="font-source-code text-[1.2rem]"
            >
              {text}
            </span>
          );
        })}
      </code>
    </pre>
  );
  return [e, bg || ""] as const;
}
