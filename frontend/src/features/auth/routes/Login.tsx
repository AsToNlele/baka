import { Button, Input } from '@nextui-org/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export const Login = () => {
  type Inputs = {
    username: string;
    password: string;
  };
  const { register, handleSubmit } = useForm<Inputs>();
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<Inputs> = (data) =>
    fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFTOKEN': Cookies.get('csrftoken')!,
      },
      body: JSON.stringify(data),
    }).then(() => navigate('/profile'));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        variant="bordered"
        placeholder="Login"
        {...register('username', { required: true })}
      />
      <Input
        variant="bordered"
        type="password"
        placeholder="Password"
        {...register('password', { required: true })}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
