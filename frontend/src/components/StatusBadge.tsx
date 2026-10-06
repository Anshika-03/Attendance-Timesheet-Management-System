type Props = {
  status: string
}

function StatusBadge({ status }: Props) {
  const styles =
    status === 'present'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'

  const getStatusLabel = (val: string) => {
    if (!val) {
      return '🔴 Absent';
    }
    switch (val) {
      case 'present':
        return '🟢 Present';
      case 'absent':
        return '🔴 Absent';
      default:
        return val;
    }
  }

  return (
    <span className={`${styles} px-3 py-1 rounded-full text-sm font-medium`}>
      {getStatusLabel(status)}
    </span>
  )
}

export default StatusBadge
