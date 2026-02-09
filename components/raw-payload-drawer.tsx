"use client";

import * as React from "react";
import { X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RawPayloadDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  rawData: string;
  recordId: string;
}

export function RawPayloadDrawer({
  isOpen,
  onClose,
  rawData,
  recordId,
}: RawPayloadDrawerProps) {
  const [copied, setCopied] = React.useState(false);
  const [parsedData, setParsedData] = React.useState<any>(null);
  const [parseError, setParseError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        setParsedData(parsed);
        setParseError(null);
      } catch (e) {
        setParseError("Failed to parse JSON");
        setParsedData(null);
      }
    }
  }, [rawData]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 flex h-screen w-full flex-col border-l border-border bg-card shadow-2xl sm:w-[600px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Raw Payload Details
            </h2>
            <p className="text-sm text-muted-foreground">Record ID: {recordId}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {parseError ? (
            <div className="space-y-4">
              <div className="rounded-md border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-800">{parseError}</p>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Raw String
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 bg-transparent"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs text-foreground">
                  {rawData}
                </pre>
              </div>
            </div>
          ) : parsedData ? (
            <div className="space-y-6">
              {/* Key Information */}
              {parsedData.response?.paymentInfo && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    Payment Information
                  </h3>
                  <div className="space-y-2 rounded-md border border-border bg-muted/30 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment ID:</span>
                      <span className="font-mono font-medium text-foreground">
                        {parsedData.response.paymentInfo.id}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <span
                        className={`font-semibold ${
                          parsedData.response.paymentInfo.status === "OK" ||
                          parsedData.response.paymentInfo.status === "ACCEPTED"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {parsedData.response.paymentInfo.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* CPO Message Response */}
              {parsedData.response?.cpoMessageResponse && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    CPO Message Response
                  </h3>
                  <div className="space-y-2 rounded-md border border-border bg-muted/30 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Message Status:</span>
                      <span className="font-semibold text-red-600">
                        {parsedData.response.cpoMessageResponse.messageStatus}
                      </span>
                    </div>
                    {parsedData.response.cpoMessageResponse.errors && (
                      <div className="mt-3">
                        <h4 className="mb-2 text-xs font-semibold text-foreground">
                          Errors
                        </h4>
                        <div className="space-y-2">
                          {parsedData.response.cpoMessageResponse.errors.map(
                            (error: any, idx: number) => (
                              <div
                                key={idx}
                                className="rounded border border-red-200 bg-red-50 p-3 text-xs"
                              >
                                <div className="font-semibold text-red-800">
                                  {error.code}: {error.text}
                                </div>
                                {error.fieldId && (
                                  <div className="mt-1 text-red-600">
                                    Field: {error.fieldId}
                                  </div>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {parsedData.response?.warnings && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-foreground">
                    Warnings
                  </h3>
                  <div className="space-y-2">
                    {parsedData.response.warnings.map((warning: any, idx: number) => (
                      <div
                        key={idx}
                        className="rounded border border-yellow-200 bg-yellow-50 p-3 text-xs"
                      >
                        <div className="font-semibold text-yellow-800">
                          {warning.code}: {warning.text}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Full JSON */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground">
                    Full JSON Payload
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-1.5 bg-transparent"
                  >
                    {copied ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded-md bg-muted p-4 text-xs text-foreground">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
