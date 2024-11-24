interface LoaderProps {
    color?: string;
}

const Loader: React.FC<LoaderProps> = ({color = "teal-500"}) => {
    return (
        <div className={`animate-spin rounded-full h-6 w-6 border-t-2 border-${color} border-opacity-50`}></div>
    )
}

export default Loader