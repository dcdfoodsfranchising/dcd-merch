import React from "react";

export default function ProfileEmail({ email }) {
  const maskEmail = (email) => {
    const [localPart, domain] = email.split("@");
    const maskedLocalPart = `${localPart[0]}${"*".repeat(localPart.length - 2)}${localPart[localPart.length - 1]}`;
    return `${maskedLocalPart}@${domain}`;
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-medium mb-4">Email</h2>
      <p className="text-sm text-gray-600">{maskEmail(email)}</p>
    </div>
  );
}