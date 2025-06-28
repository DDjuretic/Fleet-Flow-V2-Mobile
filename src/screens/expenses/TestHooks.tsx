import React from 'react';
import { View, Text } from 'react-native';
import { 
  useGetExpensesQuery,
  useCreateExpenseReceiptMutation,
  useDeleteExpenseReceiptMutation
} from '../../store/api/supabaseApi';

export default function TestHooks() {
  const { data: expenses = [] } = useGetExpensesQuery();
  const [createReceipt] = useCreateExpenseReceiptMutation();
  const [deleteReceipt] = useDeleteExpenseReceiptMutation();

  return (
    <View>
      <Text>Test: {expenses.length} expenses found</Text>
      <Text>Hooks loaded successfully</Text>
    </View>
  );
} 