import React, { useState, ReactNode } from "react";
import { useMesonFields, IMesonFieldItem, FooterButtons, IFooterButtonOptions } from "@jimengio/meson-form";
import { ITask } from "models/alias";
import { MesonModal } from "@jimengio/meson-modal";
import { useAtom } from "@jimengio/rex/lib/use-atom";
import { genSeedApiTree } from "generator/generated-api-tree";

export let useEditTask = (props: { afterChange: () => void }) => {
  // Model

  let stateAtom = useAtom({
    editing: false,
    new: false,
  });

  // Plugins

  let taskCreation = genSeedApiTree.tasks.dynamicPOST();
  let taskUpdate = genSeedApiTree.tasks._.dynamicPUT();

  let items: IMesonFieldItem<ITask>[] = [
    {
      type: "input",
      name: "title",
      label: "Title",
      required: true,
    },
    {
      type: "textarea",
      name: "content",
      label: "Content",
    },
    {
      type: "number",
      name: "priority",
      label: "Priority",
      validator: (x: number) => {
        if (x != null) {
          if (x < 1) {
            return "Littler than 1!";
          } else if (x > 5) {
            return "Greater than 5!";
          }
        }
      },
    },
  ];

  let formFields = useMesonFields({
    items: items,
    initialValue: {} as ITask,
    onSubmit: async (formData) => {
      if (stateAtom.current.new) {
        await taskCreation.request({}, formData);
      } else {
        await taskUpdate.request({ id: formData.id }, formData);
      }
      stateAtom.swapWith((state) => {
        state.editing = false;
      });
      props.afterChange?.();
    },
  });

  // View
  let ui = (
    <MesonModal
      visible={stateAtom.current.editing}
      title={stateAtom.current.new ? "Create task" : "Edit task"}
      onClose={() => {
        stateAtom.swapWith((state) => {
          state.editing = false;
        });
      }}
      renderContent={() => {
        let buttons: IFooterButtonOptions[] = [
          {
            text: "Cancel",
            onClick: () => {
              stateAtom.swapWith((state) => {
                state.editing = false;
              });
            },
          },
          {
            text: " Submit",
            filled: true,
            disabled: taskUpdate.isLoading || taskCreation.isLoading,
            onClick: () => {
              formFields.checkAndSubmit();
            },
          },
        ];

        return (
          <>
            {formFields.ui}
            <FooterButtons items={buttons} />
          </>
        );
      }}
    ></MesonModal>
  );

  // Controller

  let onCreate = () => {
    formFields.resetForm({} as ITask);
    stateAtom.swapWith((state) => {
      state.editing = true;
      state.new = true;
    });
  };

  let onEdit = (data: ITask) => {
    formFields.resetForm(data);
    stateAtom.swapWith((state) => {
      state.editing = true;
      state.new = false;
    });
  };

  return { ui, create: onCreate, edit: onEdit };
};
