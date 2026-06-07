'use client';

import { PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import {
  Button,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Textarea,
} from '@/components/atoms/index.atoms';
import { HeaderManager } from '@/components/molecules/header-manager.molecule';
import { ConfirmationDialog } from '@/components/molecules/index.molecules';

export interface ActionItem {
  _id?: string;
  fallbackModel?: string;
  id?: string;
  model: string;
  name: string;
  prompt: string;
}

export function ManageView() {
  const [actions, setActions] = useState<ActionItem[]>([]);
  const [models, setModels] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [editingId, setEditingId] = useState<null | string>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('');
  const [fallbackModel, setFallbackModel] = useState('');

  useEffect(() => {
    fetchModels();
    fetchActions();
  }, []);

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      if (res.ok) {
        const data = await res.json();
        setModels(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchActions = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/actions');
      if (res.ok) {
        const data = await res.json();
        setActions(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (action: ActionItem) => {
    if (!action.id || !action._id) {
      return;
    }
    setEditingId(action.id || action._id || null);
    setName(action.name);
    setPrompt(action.prompt);
    setModel(action.model);
    setFallbackModel(action.fallbackModel || '');
    setShowForm(true);
  };

  const handleDelete = async (id: undefined | string) => {
    if (!id) {
      return;
    }
    try {
      const res = await fetch(`/api/actions/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchActions();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    if (!name || !model || !prompt) return;

    setIsSaving(true);
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/actions/${editingId}` : '/api/actions';

      const payload = {
        fallbackModel: fallbackModel === 'none' ? undefined : fallbackModel,
        model,
        name,
        prompt,
      };

      const res = await fetch(url, {
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        method,
      });

      if (res.ok) {
        setShowForm(false);
        setEditingId(null);
        setName('');
        setPrompt('');
        setModel('');
        setFallbackModel('');
        fetchActions();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <HeaderManager title='Action Definitions' />
      <div className='p-6 max-w-5xl mx-auto space-y-6'>
        <div className='flex justify-between items-center'>
          <h2 className='text-lg font-bold uppercase tracking-widest text-content-primary'>
            Manage Prompts
          </h2>
          {!showForm && (
            <Button
              className='rounded-none bg-brand text-white'
              onClick={() => setShowForm(true)}
            >
              <PlusIcon className='w-4 h-4 mr-2' /> Add Action
            </Button>
          )}
        </div>

        {showForm && (
          <div className='p-6 border border-border bg-surface space-y-4'>
            <h3 className='text-sm font-bold uppercase mb-4'>
              {editingId ? 'Edit Action' : 'New Action'}
            </h3>

            <div className='space-y-4'>
              <div>
                <label className='text-xs uppercase text-content-secondary mb-1 block'>
                  Name
                </label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder='e.g. Create Theme'
                  value={name}
                />
              </div>

              <div>
                <label className='text-xs uppercase text-content-secondary mb-1 block'>
                  Prompt Template
                </label>
                <Textarea
                  className='font-mono text-sm'
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setPrompt(e.target.value)
                  }
                  rows={6}
                  value={prompt}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='text-xs uppercase text-content-secondary mb-1 block'>
                    Model
                  </label>
                  <Select onValueChange={setModel} value={model}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select primary model' />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className='text-xs uppercase text-content-secondary mb-1 block'>
                    Fallback Model
                  </label>
                  <Select
                    disabled={models.length <= 1}
                    onValueChange={setFallbackModel}
                    value={fallbackModel}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select fallback model' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='none'>None</SelectItem>
                      {models.map(m => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setName('');
                  setPrompt('');
                  setModel('');
                  setFallbackModel('');
                }}
                variant='ghost'
              >
                Cancel
              </Button>
              <Button
                className='bg-brand text-white'
                disabled={isSaving || !name || !prompt || !model}
                onClick={handleSave}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        )}

        {isLoading && !showForm && (
          <div className='border border-border bg-surface overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Fallback</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[1, 2, 3].map(i => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className='h-4 w-32' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell>
                      <Skeleton className='h-4 w-24' />
                    </TableCell>
                    <TableCell className='text-right flex justify-end gap-2'>
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {!isLoading && !showForm && (
          <div className='border border-border bg-surface overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Fallback</TableHead>
                  <TableHead className='text-right'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      className='text-center py-8 text-content-secondary'
                      colSpan={4}
                    >
                      No action definitions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  actions.map(action => (
                    <TableRow key={action.id || action._id}>
                      <TableCell className='font-bold'>{action.name}</TableCell>
                      <TableCell className='font-mono text-xs'>
                        {models.find(m => m.id === action.model)?.name ||
                          action.model}
                      </TableCell>
                      <TableCell className='font-mono text-xs'>
                        {action.fallbackModel && action.fallbackModel !== 'none'
                          ? models.find(m => m.id === action.fallbackModel)
                              ?.name || action.fallbackModel
                          : '-'}
                      </TableCell>
                      <TableCell className='text-right'>
                        <Button
                          onClick={() => handleEdit(action)}
                          size='icon'
                          variant='ghost'
                        >
                          <PencilIcon className='w-4 h-4' />
                        </Button>
                        <ConfirmationDialog
                          description={`Are you sure you want to delete ${action.name}?`}
                          onConfirm={() =>
                            handleDelete(action.id || action._id)
                          }
                          title='Delete Action Definition?'
                          trigger={
                            <Button
                              className='text-status-red'
                              size='icon'
                              variant='ghost'
                            >
                              <Trash2Icon className='w-4 h-4' />
                            </Button>
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </>
  );
}
