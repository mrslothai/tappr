import PassCard from './PassCard';

export default function PassList({ passes, onDeletePass, onTestNotification }) {
  return (
    <>
      {passes.map((pass) => (
        <PassCard
          key={pass.id}
          pass={pass}
          onDeletePass={onDeletePass}
          onTestNotification={onTestNotification}
        />
      ))}
    </>
  );
}
