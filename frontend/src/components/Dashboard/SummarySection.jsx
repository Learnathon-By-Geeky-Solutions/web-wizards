import SummaryCard from './SummaryCard';

const SummarySection = () => {
  const summaryCards = [
    {
      id: 'appointments',
      title: 'Appointments',
      content: 'No upcoming appointments.',
    },
    {
      id: 'doctors',
      title: 'Your Doctors',
      content: 'No doctors assigned.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {summaryCards.map((card) => (
        <SummaryCard key={card.id} title={card.title} content={card.content} />
      ))}
    </div>
  );
};

export default SummarySection;