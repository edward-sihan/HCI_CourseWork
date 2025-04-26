import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router";

type FormData = {
  userName: string;
  email: string;
  password: string;
};

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const navigate = useNavigate();

  const { mutate: registerUser, isPending: registeringUser } = useMutation({
    mutationFn: (newUser: FormData) => {
      return axios.post("http://localhost:3000/api/admin/register", newUser)
    },
    // mutationKey
    onMutate: (variables) => {
      console.log('Starting registration for: ', variables.email)
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      const message = error.response?.data
      toast.error(message.message)
    },

    onSuccess: (data) => {
      console.log(data)
      toast.success('User successully registered Redirecting to Home')
      navigate('/')
    },

    onSettled: () => {
      //reset the form
      reset()
    }
  })

  const onSubmit = (data: FormData) => {
    const newData = { ...data, role: "admin" }
    console.log(newData);

    // You can now send this data to your backend
    registerUser(newData)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto mt-8 p-6 bg-white rounded shadow space-y-4">
      <h2>Register</h2>

      {/* input 1 */}
      <div>
        <label className="block mb-1 font-medium">username</label>
        <input {...register("userName", { required: 'Username is required' })} className="w-full border p-2 rounded" />
        {errors.userName && <p className="text-red-500 text-sm">{errors.userName.message}</p>}
      </div>

      {/* input 2 */}
      <div>
        <label className="block mb-1 font-medium">email</label>
        <input {...register("email", { required: 'Username is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }, })} className="w-full border p-2 rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      {/* input 3 */}
      <div>
        <label className="block mb-1 font-medium">Password</label>
        <input
          type="password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "Password must be at least 6 characters" },
          })}
          className="w-full border p-2 rounded"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      {/* submit button */}
      <button
        disabled={registeringUser}
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        {registeringUser ? 'Registering...' : "Register"}
      </button>
      <div className="flex flex-row justify-between">
        <p>already have and account</p>
        <Link to="/login">Login</Link>
      </div>
    </form>
  );
}

export default Register;
