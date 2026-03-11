import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

type Inventor = {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  rewardPercentage: number;
};

type ProposalFormValues = {
  inventors: Inventor[];
};

export default function DynamicInventorForm() {
  const { control, handleSubmit, watch, formState: { errors } } = useForm<ProposalFormValues>({
    defaultValues: {
      inventors: [{ id: '1', employeeId: '', name: '', department: '', rewardPercentage: 100 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'inventors'
  });

  const [totalPercentage, setTotalPercentage] = useState(100);
  const inventors = watch('inventors');

  // 动态监听比例总和
  useEffect(() => {
    const total = inventors.reduce((sum, inv) => sum + (Number(inv.rewardPercentage) || 0), 0);
    setTotalPercentage(total);
  }, [inventors]);

  const onSubmit = (data: ProposalFormValues) => {
    if (totalPercentage !== 100) {
      alert(`当前奖励比例总和为 ${totalPercentage}%，必须等于 100% 才能提交！`);
      return;
    }
    console.log('提交的发明人数据 (符合 100% 校验):', data);
    alert('提交成功！数据已打印至控制台。');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-4 border border-gray-200">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-xl font-bold text-gray-800">发明人信息区块 (MVP)</h2>
        <div className={`px-4 py-2 rounded font-semibold ${totalPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          当前奖励比例总和: {totalPercentage}%
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {fields.map((field, index) => (
          <div key={field.id} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-lg border">
            <div className="col-span-1 text-gray-500 font-medium">#{index + 1}</div>
            
            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">工号/姓名</label>
              <Controller
                control={control}
                name={`inventors.${index}.name`}
                rules={{ required: '必填' }}
                render={({ field }) => (
                  <input {...field} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="输入姓名..." />
                )}
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">所属部门</label>
              <Controller
                control={control}
                name={`inventors.${index}.department`}
                render={({ field }) => (
                  <input {...field} className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none" placeholder="如: 研发中心" />
                )}
              />
            </div>

            <div className="col-span-3">
              <label className="block text-xs text-gray-500 mb-1">奖励比例 (%) *</label>
              <Controller
                control={control}
                name={`inventors.${index}.rewardPercentage`}
                rules={{ required: true, min: 0, max: 100 }}
                render={({ field }) => (
                  <input 
                    {...field} 
                    type="number" 
                    className={`w-full px-3 py-2 border rounded focus:ring-2 outline-none ${errors.inventors?.[index]?.rewardPercentage ? 'border-red-500 focus:ring-red-500' : 'focus:ring-blue-500'}`} 
                  />
                )}
              />
            </div>

            <div className="col-span-2 flex justify-end">
              <button 
                type="button" 
                onClick={() => remove(index)}
                disabled={fields.length === 1}
                className="text-red-500 hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium text-sm px-2"
              >
                删除
              </button>
            </div>
          </div>
        ))}

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => append({ id: Date.now().toString(), employeeId: '', name: '', department: '', rewardPercentage: 0 })}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 font-medium transition"
          >
            + 添加共同发明人
          </button>
          
          <button
            type="submit"
            className={`px-6 py-2 rounded text-white font-medium transition ${totalPercentage === 100 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            保存并校验比例
          </button>
        </div>
        
        {totalPercentage !== 100 && (
          <p className="text-red-500 text-sm mt-2">
            * 错误: 所有发明人的奖励比例总和必须精确等于 100% (当前为 {totalPercentage}%)。
          </p>
        )}
      </form>
    </div>
  );
}
