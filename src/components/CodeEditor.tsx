import Editor from "@monaco-editor/react";

interface CodeEditorProps {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export default function CodeEditor({
  language,
  value,
  onChange,
}: CodeEditorProps) {
  return (
    <div style={{ borderRadius: "8px", overflow: "hidden" }}>
      <Editor
        height="400px"
        language={language}
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
}
