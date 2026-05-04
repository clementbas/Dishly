import toast from 'react-hot-toast';

export const useToast = () => ({
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  loading: (msg) => toast.loading(msg),
  dismiss: (id) => toast.dismiss(id),
  promise: (promise, msgs) => toast.promise(promise, msgs),
});
