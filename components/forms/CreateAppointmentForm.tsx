'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import CustomFormField from '../CustomFormField';
import SubmitButton from '../SubmitButton';
import { useState } from 'react';
import { getAppointmentSchema } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { FormFieldType, Status } from '@/types';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { createAppointment } from '@/lib/actions/appointment.actions';

const CreateAppointmentForm = ({
  userId,
  type,
  patientId,
}: {
  userId: string;
  type: 'create' | 'cancel' | 'schedule';
  patientId: string;
}) => {
  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    default:
      break;
  }

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formType = getAppointmentSchema(type);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formType>>({
    resolver: zodResolver(formType),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(),
      reason: '',
      note: '',
      cancellationReason: '',
    },
  });
  console.log(form.formState.errors);

  // 2. Define a submit handler.
  const onSubmit = async (values: z.infer<typeof formType>) => {
    setIsLoading(true);

    let status;

    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;

      case 'cancel':
        status = 'cancelled';
        break;

      case 'create':
        status = 'pending';
        break;

      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);
        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-10 flex-1"
      >
        <section className="space-y-4 ">
          <h1 className="header">Hey there 👋</h1>
          <p className="text-dark-700">
            Request a new appointment in just 10 seconds.
          </p>
        </section>
        {type == 'create' && (
          <>
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex gap-2 cursor-pointer items-center">
                    <Image
                      src={doctor.image}
                      alt={doctor.name}
                      width={32}
                      height={32}
                      className="rounded-full border border-dark-500"
                    />
                    <p className="text-14">{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="reason"
                label="Reason for appointment"
                placeholder="Annual monthly check-up"
              />
              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="note"
                label="Additional comments/notes"
                placeholder="Prefer afternoon appointments, if possible"
              />
            </div>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
          </>
        )}

        {type === 'cancel' && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
};

export default CreateAppointmentForm;
